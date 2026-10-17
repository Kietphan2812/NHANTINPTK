const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  maxHttpBufferSize: 1e7 // 10MB
});

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Setup Multer for file/image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Safe user serializer (omit password from public payloads)
function safeUser(u, isOnline = false) {
  if (!u) return null;
  const { password, ...rest } = u;
  return {
    ...rest,
    status: isOnline ? 'online' : (u.status || 'offline'),
    friends: u.friends || [],
    friendRequestsReceived: u.friendRequestsReceived || [],
    friendRequestsSent: u.friendRequestsSent || []
  };
}

// Initial seed data: NO FAKE ACCOUNTS, ONLY REAL REGISTERED USERS
const initialData = {
  users: [],
  rooms: [
    {
      id: 'room_general',
      name: '🌟 Hội Bạn Thân (Chém gió)',
      avatar: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=150&auto=format&fit=crop&q=80',
      description: 'Nhóm trò chuyện công khai cho mọi người',
      isGroup: true
    }
  ],
  messages: []
};

// Database helper
function normalizeDB(data) {
  if (!data.users) data.users = [];
  if (!data.rooms) data.rooms = initialData.rooms;
  if (!data.messages) data.messages = [];

  // Remove any remaining fake users if present
  const fakeIds = ['user_quan', 'user_linh', 'user_tuan', 'user_ngoc'];
  data.users = data.users.filter(u => !fakeIds.includes(u.id));

  // Normalize each real user
  data.users.forEach(u => {
    if (!u.username) {
      u.username = (u.tag ? u.tag.replace('@', '') : u.id).toLowerCase();
    }
    if (!u.tag) u.tag = `@${u.username}`;
    if (!Array.isArray(u.friends)) u.friends = [];
    if (!Array.isArray(u.friendRequestsReceived)) u.friendRequestsReceived = [];
    if (!Array.isArray(u.friendRequestsSent)) u.friendRequestsSent = [];

    // Filter out fake IDs from friend lists
    u.friends = u.friends.filter(fId => !fakeIds.includes(fId));
    u.friendRequestsReceived = u.friendRequestsReceived.filter(fId => !fakeIds.includes(fId));
    u.friendRequestsSent = u.friendRequestsSent.filter(fId => !fakeIds.includes(fId));
  });

  // Filter out fake messages
  data.messages = data.messages.filter(m => !fakeIds.includes(m.senderId));

  return data;
}

function loadDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const normalized = normalizeDB(JSON.parse(JSON.stringify(initialData)));
      fs.writeFileSync(DB_FILE, JSON.stringify(normalized, null, 2), 'utf-8');
      return normalized;
    }
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    return normalizeDB(data);
  } catch (err) {
    console.error('Error reading db:', err);
    return normalizeDB(JSON.parse(JSON.stringify(initialData)));
  }
}

function saveDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db:', err);
  }
}

// Memory cache of DB
let db = loadDB();

// Track online sockets: userId -> Set of socket.ids
const userSocketsMap = new Map();

function isUserOnline(userId) {
  return userSocketsMap.has(userId) && userSocketsMap.get(userId).size > 0;
}

// ===================================================================
// REST API ENDPOINTS
// ===================================================================

// Upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Không có tệp nào được tải lên' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    url: fileUrl,
    filename: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size
  });
});

// Bootstrap state
app.get('/api/bootstrap', (req, res) => {
  const usersWithStatus = db.users.map(u => safeUser(u, isUserOnline(u.id)));
  res.json({
    users: usersWithStatus,
    rooms: db.rooms
  });
});

// Authentication: Register
app.post('/api/auth/register', (req, res) => {
  const { name, phone, username, password, avatar, bio } = req.body;

  if (!name || !phone || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập họ tên, số điện thoại và mật khẩu!' });
  }

  const cleanPhone = phone.trim().replace(/\s+/g, '');
  const cleanUsername = (username || cleanPhone).trim().toLowerCase().replace(/[@\s]/g, '');

  if (!/^[0-9]{9,11}$/.test(cleanPhone)) {
    return res.status(400).json({ error: 'Số điện thoại không hợp lệ (cần từ 9 đến 11 chữ số)!' });
  }

  const existingPhone = db.users.find(u => u.phone === cleanPhone);
  if (existingPhone) {
    return res.status(400).json({ error: 'Số điện thoại này đã được đăng ký tài khoản!' });
  }

  const existingUser = db.users.find(u => u.username === cleanUsername);
  if (existingUser) {
    return res.status(400).json({ error: 'Tên đăng nhập này đã được sử dụng, vui lòng chọn tên khác!' });
  }

  const newUser = {
    id: `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    name: name.trim(),
    tag: `@${cleanUsername}`,
    username: cleanUsername,
    phone: cleanPhone,
    password: password.trim(),
    avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanUsername)}`,
    bio: bio ? bio.trim() : 'Chào bạn, tôi vừa tham gia ZaloChat!',
    friends: [],
    friendRequestsReceived: [],
    friendRequestsSent: [],
    status: 'offline',
    lastSeen: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDB(db);

  // Broadcast new user list immediately to all connected sockets
  io.emit('users:list_updated', db.users.map(u => safeUser(u, isUserOnline(u.id))));

  res.json({
    success: true,
    user: safeUser(newUser, false)
  });
});

// Authentication: Login
app.post('/api/auth/login', (req, res) => {
  const { account, password } = req.body;

  if (!account || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập số điện thoại hoặc tên đăng nhập và mật khẩu!' });
  }

  const cleanAcc = account.trim().toLowerCase().replace(/[@\s]/g, '');
  const rawAcc = account.trim().replace(/\s+/g, '');

  const user = db.users.find(u => 
    u.phone === rawAcc || 
    (u.username && u.username.toLowerCase() === cleanAcc)
  );

  if (!user) {
    return res.status(400).json({ error: 'Số điện thoại hoặc tên đăng nhập không tồn tại!' });
  }

  if (user.password && user.password !== password.trim()) {
    return res.status(400).json({ error: 'Mật khẩu không chính xác, vui lòng kiểm tra lại!' });
  }

  res.json({
    success: true,
    user: safeUser(user, isUserOnline(user.id))
  });
});

// Search users by phone number or username
app.get('/api/users/search', (req, res) => {
  const query = (req.query.q || '').trim().toLowerCase();
  const currentUserId = req.query.currentUserId;

  if (!query) {
    return res.json({ results: [] });
  }

  const currentUser = db.users.find(u => u.id === currentUserId);
  const cleanQ = query.replace(/[@\s]/g, '');

  const matched = db.users.filter(u => {
    if (u.id === currentUserId) return false;
    const matchPhone = u.phone && u.phone.includes(cleanQ);
    const matchUsername = u.username && u.username.toLowerCase().includes(cleanQ);
    const matchName = u.name && u.name.toLowerCase().includes(query);
    return matchPhone || matchUsername || matchName;
  });

  const results = matched.map(u => {
    let isFriend = false;
    if (currentUser && (currentUser.friends || []).includes(u.id)) {
      isFriend = true;
    }

    return {
      ...safeUser(u, isUserOnline(u.id)),
      isFriend
    };
  });

  res.json({ results });
});

// ===================================================================
// SOCKET.IO REAL-TIME LOGIC
// ===================================================================

io.on('connection', (socket) => {
  let currentUser = null;

  // User connection registration
  socket.on('user:login', (userData) => {
    if (!userData || !userData.id) return;
    let user = db.users.find(u => u.id === userData.id);
    if (!user) return;

    currentUser = user;

    // Join user's personal private room
    socket.join(`user_${user.id}`);

    if (!userSocketsMap.has(user.id)) {
      userSocketsMap.set(user.id, new Set());
    }
    userSocketsMap.get(user.id).add(socket.id);

    // Auto join default rooms
    db.rooms.forEach(room => {
      socket.join(room.id);
    });

    // Notify client of successful login
    socket.emit('login:success', {
      user: safeUser(user, true),
      users: db.users.map(u => safeUser(u, isUserOnline(u.id))),
      rooms: db.rooms
    });

    // Broadcast user presence change to all clients
    io.emit('user:status_changed', {
      userId: user.id,
      status: 'online',
      lastSeen: new Date().toISOString()
    });
  });

  // Direct Add Friend (Instant add without reload)
  socket.on('friend:add_direct', ({ targetUserId }) => {
    if (!currentUser || !targetUserId || currentUser.id === targetUserId) return;

    const me = db.users.find(u => u.id === currentUser.id);
    const target = db.users.find(u => u.id === targetUserId);
    if (!me || !target) return;

    if (!Array.isArray(me.friends)) me.friends = [];
    if (!Array.isArray(target.friends)) target.friends = [];

    if (!me.friends.includes(targetUserId)) {
      me.friends.push(targetUserId);
    }
    if (!target.friends.includes(currentUser.id)) {
      target.friends.push(currentUser.id);
    }

    saveDB(db);

    // Notify target user room immediately
    io.to(`user_${targetUserId}`).emit('friend:added', {
      friend: safeUser(me, isUserOnline(me.id)),
      message: `${me.name} đã thêm bạn vào danh bạ!`
    });

    // Notify sender user room immediately
    io.to(`user_${currentUser.id}`).emit('friend:added', {
      friend: safeUser(target, isUserOnline(target.id)),
      message: `Đã kết bạn thành công với ${target.name}!`
    });

    // Broadcast updated users list
    io.emit('users:list_updated', db.users.map(u => safeUser(u, isUserOnline(u.id))));
  });

  // Request chat history
  socket.on('chat:get_history', ({ targetId, isGroup }) => {
    if (!currentUser) return;

    let relevantMessages = [];
    if (isGroup) {
      relevantMessages = db.messages.filter(m => m.targetId === targetId);
    } else {
      relevantMessages = db.messages.filter(m => 
        !m.isGroup &&
        ((m.senderId === currentUser.id && m.targetId === targetId) ||
         (m.senderId === targetId && m.targetId === currentUser.id))
      );
    }

    socket.emit('chat:history', {
      targetId,
      isGroup,
      messages: relevantMessages
    });
  });

  // Sending a message: Realtime dispatch to both rooms
  socket.on('message:send', (msgData) => {
    if (!currentUser) return;

    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      targetId: msgData.targetId,
      isGroup: !!msgData.isGroup,
      text: (msgData.text || '').trim(),
      imageUrl: msgData.imageUrl || null,
      fileUrl: msgData.fileUrl || null,
      fileName: msgData.fileName || null,
      replyTo: msgData.replyTo || null,
      timestamp: Date.now(),
      reactions: {},
      recalled: false
    };

    db.messages.push(newMessage);
    saveDB(db);

    if (msgData.isGroup) {
      // Group room broadcast
      io.to(msgData.targetId).emit('message:new', newMessage);
    } else {
      // Direct message: Instant delivery to recipient's room AND sender's room
      io.to(`user_${msgData.targetId}`).emit('message:new', newMessage);
      io.to(`user_${currentUser.id}`).emit('message:new', newMessage);
    }
  });

  // Typing indicator
  socket.on('typing:start', ({ targetId, isGroup }) => {
    if (!currentUser) return;
    const payload = {
      senderId: currentUser.id,
      senderName: currentUser.name,
      targetId,
      isGroup
    };

    if (isGroup) {
      socket.to(targetId).emit('typing:display', payload);
    } else {
      socket.to(`user_${targetId}`).emit('typing:display', payload);
    }
  });

  socket.on('typing:stop', ({ targetId, isGroup }) => {
    if (!currentUser) return;
    const payload = {
      senderId: currentUser.id,
      targetId,
      isGroup
    };

    if (isGroup) {
      socket.to(targetId).emit('typing:hide', payload);
    } else {
      socket.to(`user_${targetId}`).emit('typing:hide', payload);
    }
  });

  // React to a message
  socket.on('message:react', ({ messageId, emoji }) => {
    if (!currentUser) return;
    const msg = db.messages.find(m => m.id === messageId);
    if (!msg) return;

    if (!msg.reactions) msg.reactions = {};
    if (!msg.reactions[emoji]) msg.reactions[emoji] = [];

    const index = msg.reactions[emoji].indexOf(currentUser.id);
    if (index > -1) {
      msg.reactions[emoji].splice(index, 1);
      if (msg.reactions[emoji].length === 0) delete msg.reactions[emoji];
    } else {
      Object.keys(msg.reactions).forEach(e => {
        msg.reactions[e] = msg.reactions[e].filter(uid => uid !== currentUser.id);
        if (msg.reactions[e].length === 0) delete msg.reactions[e];
      });
      if (!msg.reactions[emoji]) msg.reactions[emoji] = [];
      msg.reactions[emoji].push(currentUser.id);
    }

    saveDB(db);
    io.emit('message:reaction_updated', {
      messageId: msg.id,
      reactions: msg.reactions,
      targetId: msg.targetId,
      isGroup: msg.isGroup
    });
  });

  // Recall message
  socket.on('message:recall', ({ messageId }) => {
    if (!currentUser) return;
    const msg = db.messages.find(m => m.id === messageId);
    if (!msg || msg.senderId !== currentUser.id) return;

    msg.recalled = true;
    msg.text = 'Tin nhắn đã được thu hồi';
    msg.imageUrl = null;
    msg.fileUrl = null;
    msg.reactions = {};

    saveDB(db);
    io.emit('message:recalled', {
      messageId: msg.id,
      targetId: msg.targetId,
      isGroup: msg.isGroup
    });
  });

  // Disconnect handler
  socket.on('disconnect', () => {
    if (currentUser) {
      const userSockets = userSocketsMap.get(currentUser.id);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          userSocketsMap.delete(currentUser.id);
          const lastSeen = new Date().toISOString();
          
          const dbUser = db.users.find(u => u.id === currentUser.id);
          if (dbUser) {
            dbUser.lastSeen = lastSeen;
            saveDB(db);
          }

          io.emit('user:status_changed', {
            userId: currentUser.id,
            status: 'offline',
            lastSeen
          });
        }
      }
    }
  });
});

// Fallback for SPA routing - serve index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Chat app running at http://localhost:${PORT}`);
});
