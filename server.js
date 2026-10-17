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

// Initial seed data with phone, username, password and friend relations
const initialData = {
  users: [
    {
      id: 'user_quan',
      name: 'Minh Quân',
      tag: '@minhquan',
      username: 'minhquan',
      phone: '0988111222',
      password: '123',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Lập trình viên • Thích công nghệ & Cà phê ☕',
      friends: ['user_linh', 'user_tuan'],
      friendRequestsReceived: [],
      friendRequestsSent: [],
      status: 'offline',
      lastSeen: new Date().toISOString()
    },
    {
      id: 'user_linh',
      name: 'Hà Linh',
      tag: '@halinh',
      username: 'halinh',
      phone: '0977333444',
      password: '123',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      bio: 'UI/UX Designer • Yêu âm nhạc & Du lịch 🎧✈️',
      friends: ['user_quan', 'user_ngoc'],
      friendRequestsReceived: [],
      friendRequestsSent: [],
      status: 'offline',
      lastSeen: new Date().toISOString()
    },
    {
      id: 'user_tuan',
      name: 'Tuấn Anh',
      tag: '@tuananh',
      username: 'tuananh',
      phone: '0966555666',
      password: '123',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'Photographer & Gamer 🎮📷',
      friends: ['user_quan'],
      friendRequestsReceived: [],
      friendRequestsSent: [],
      status: 'offline',
      lastSeen: new Date().toISOString()
    },
    {
      id: 'user_ngoc',
      name: 'Bảo Ngọc',
      tag: '@baongoc',
      username: 'baongoc',
      phone: '0955777888',
      password: '123',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      bio: 'Content Creator • Yêu mèo 🐱✨',
      friends: ['user_linh'],
      friendRequestsReceived: [],
      friendRequestsSent: [],
      status: 'offline',
      lastSeen: new Date().toISOString()
    }
  ],
  rooms: [
    {
      id: 'room_general',
      name: '🌟 Hội Bạn Thân (Chém gió)',
      avatar: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=150&auto=format&fit=crop&q=80',
      description: 'Nhóm trò chuyện công khai cho mọi người',
      isGroup: true
    }
  ],
  messages: [
    {
      id: 'msg_welcome_1',
      senderId: 'user_quan',
      senderName: 'Minh Quân',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      targetId: 'room_general',
      isGroup: true,
      text: 'Chào cả nhà! Chúc mọi người một ngày làm việc và trò chuyện vui vẻ nhé 🚀',
      timestamp: Date.now() - 3600000,
      reactions: { '❤️': ['user_linh', 'user_ngoc'], '👍': ['user_tuan'] }
    },
    {
      id: 'msg_welcome_2',
      senderId: 'user_linh',
      senderName: 'Hà Linh',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      targetId: 'room_general',
      isGroup: true,
      text: 'Giao diện web chat này xịn xò quá nè mọi người ơi! Có gửi ảnh, thả tim, âm thanh đầy đủ như Messenger luôn á 😍',
      timestamp: Date.now() - 1800000,
      reactions: { '🔥': ['user_quan'] }
    }
  ]
};

// Database helper
function normalizeDB(data) {
  if (!data.users) data.users = [];
  if (!data.rooms) data.rooms = initialData.rooms;
  if (!data.messages) data.messages = [];

  // Normalize existing users with new fields
  data.users.forEach((u, idx) => {
    if (!u.username) {
      u.username = (u.tag ? u.tag.replace('@', '') : `user_${idx}`).toLowerCase();
    }
    if (!u.tag) u.tag = `@${u.username}`;
    if (!u.phone) {
      const defaultPhones = ['0988111222', '0977333444', '0966555666', '0955777888'];
      u.phone = defaultPhones[idx] || `090${Math.floor(1000000 + Math.random() * 9000000)}`;
    }
    if (!u.password) u.password = '123';
    if (!Array.isArray(u.friends)) u.friends = [];
    if (!Array.isArray(u.friendRequestsReceived)) u.friendRequestsReceived = [];
    if (!Array.isArray(u.friendRequestsSent)) u.friendRequestsSent = [];
  });

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

// Track online sockets: socket.id -> userId
const socketUserMap = new Map();
// userId -> Set of socket.ids (a user can have multiple tabs open)
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

  // Validate phone format
  if (!/^[0-9]{9,11}$/.test(cleanPhone)) {
    return res.status(400).json({ error: 'Số điện thoại không hợp lệ (cần từ 9 đến 11 chữ số)!' });
  }

  // Check unique phone
  const existingPhone = db.users.find(u => u.phone === cleanPhone);
  if (existingPhone) {
    return res.status(400).json({ error: 'Số điện thoại này đã được đăng ký tài khoản!' });
  }

  // Check unique username
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
    friends: ['user_quan', 'user_linh'], // Auto befriend demo contacts for great immediate experience
    friendRequestsReceived: [],
    friendRequestsSent: [],
    status: 'offline',
    lastSeen: new Date().toISOString()
  };

  // Add new user to demo users' friend lists
  const quan = db.users.find(u => u.id === 'user_quan');
  if (quan && !quan.friends.includes(newUser.id)) quan.friends.push(newUser.id);
  const linh = db.users.find(u => u.id === 'user_linh');
  if (linh && !linh.friends.includes(newUser.id)) linh.friends.push(newUser.id);

  db.users.push(newUser);
  saveDB(db);

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
    let relation = 'none'; // 'friend' | 'pending_sent' | 'pending_received' | 'none'
    if (currentUser) {
      if ((currentUser.friends || []).includes(u.id)) {
        relation = 'friend';
      } else if ((currentUser.friendRequestsSent || []).includes(u.id)) {
        relation = 'pending_sent';
      } else if ((currentUser.friendRequestsReceived || []).includes(u.id)) {
        relation = 'pending_received';
      }
    }

    return {
      ...safeUser(u, isUserOnline(u.id)),
      relation
    };
  });

  res.json({ results });
});

// Get user profile with friend lists
app.get('/api/users/:userId/friends', (req, res) => {
  const user = db.users.find(u => u.id === req.params.userId);
  if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng' });

  const friends = (user.friends || []).map(fId => {
    const f = db.users.find(u => u.id === fId);
    return f ? safeUser(f, isUserOnline(f.id)) : null;
  }).filter(Boolean);

  const pendingReceived = (user.friendRequestsReceived || []).map(rId => {
    const r = db.users.find(u => u.id === rId);
    return r ? safeUser(r, isUserOnline(r.id)) : null;
  }).filter(Boolean);

  const pendingSent = (user.friendRequestsSent || []).map(sId => {
    const s = db.users.find(u => u.id === sId);
    return s ? safeUser(s, isUserOnline(s.id)) : null;
  }).filter(Boolean);

  res.json({
    friends,
    pendingReceived,
    pendingSent
  });
});

// ===================================================================
// SOCKET.IO REAL-TIME LOGIC
// ===================================================================

io.on('connection', (socket) => {
  let currentUser = null;

  // User connection registration
  socket.on('user:login', (userData) => {
    let user = db.users.find(u => u.id === userData.id);
    if (!user) {
      user = {
        id: userData.id || `user_${Date.now()}`,
        name: userData.name || 'Người dùng mới',
        tag: `@${(userData.name || 'user').toLowerCase().replace(/\s+/g, '')}`,
        username: (userData.name || 'user').toLowerCase().replace(/\s+/g, ''),
        phone: userData.phone || '0901234567',
        password: '123',
        avatar: userData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userData.name || 'user')}`,
        bio: userData.bio || 'Chào bạn, tôi vừa tham gia!',
        friends: ['user_quan', 'user_linh'],
        friendRequestsReceived: [],
        friendRequestsSent: [],
        status: 'online',
        lastSeen: new Date().toISOString()
      };
      db.users.push(user);
      saveDB(db);
    }

    currentUser = user;
    socketUserMap.set(socket.id, user.id);

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

  // Friend Request: Send
  socket.on('friend:send_request', ({ targetUserId }) => {
    if (!currentUser || !targetUserId || currentUser.id === targetUserId) return;

    const targetUser = db.users.find(u => u.id === targetUserId);
    const senderUser = db.users.find(u => u.id === currentUser.id);
    if (!targetUser || !senderUser) return;

    if (!Array.isArray(senderUser.friendRequestsSent)) senderUser.friendRequestsSent = [];
    if (!Array.isArray(targetUser.friendRequestsReceived)) targetUser.friendRequestsReceived = [];

    if (!senderUser.friendRequestsSent.includes(targetUserId)) {
      senderUser.friendRequestsSent.push(targetUserId);
    }
    if (!targetUser.friendRequestsReceived.includes(currentUser.id)) {
      targetUser.friendRequestsReceived.push(currentUser.id);
    }

    saveDB(db);

    // Emit to sender
    socket.emit('friend:request_sent_success', {
      targetUserId,
      targetUser: safeUser(targetUser, isUserOnline(targetUserId))
    });

    // Emit to recipient's sockets
    const targetSockets = userSocketsMap.get(targetUserId);
    if (targetSockets) {
      targetSockets.forEach(sId => {
        io.to(sId).emit('friend:request_received', {
          fromUser: safeUser(senderUser, isUserOnline(senderUser.id))
        });
      });
    }
  });

  // Friend Request: Accept
  socket.on('friend:accept_request', ({ targetUserId }) => {
    if (!currentUser || !targetUserId) return;

    const me = db.users.find(u => u.id === currentUser.id);
    const friend = db.users.find(u => u.id === targetUserId);
    if (!me || !friend) return;

    // Remove from pending
    me.friendRequestsReceived = (me.friendRequestsReceived || []).filter(id => id !== targetUserId);
    friend.friendRequestsSent = (friend.friendRequestsSent || []).filter(id => id !== currentUser.id);

    // Add to friends
    if (!me.friends) me.friends = [];
    if (!friend.friends) friend.friends = [];

    if (!me.friends.includes(targetUserId)) me.friends.push(targetUserId);
    if (!friend.friends.includes(currentUser.id)) friend.friends.push(currentUser.id);

    saveDB(db);

    // Notify current user
    const mySockets = userSocketsMap.get(currentUser.id);
    if (mySockets) {
      mySockets.forEach(sId => {
        io.to(sId).emit('friend:request_accepted', {
          friendUser: safeUser(friend, isUserOnline(friend.id))
        });
      });
    }

    // Notify target user
    const targetSockets = userSocketsMap.get(targetUserId);
    if (targetSockets) {
      targetSockets.forEach(sId => {
        io.to(sId).emit('friend:request_accepted', {
          friendUser: safeUser(me, isUserOnline(me.id))
        });
      });
    }

    // Broadcast updated users list
    io.emit('users:list_updated', db.users.map(u => safeUser(u, isUserOnline(u.id))));
  });

  // Friend Request: Decline
  socket.on('friend:decline_request', ({ targetUserId }) => {
    if (!currentUser || !targetUserId) return;

    const me = db.users.find(u => u.id === currentUser.id);
    const requester = db.users.find(u => u.id === targetUserId);
    if (!me) return;

    me.friendRequestsReceived = (me.friendRequestsReceived || []).filter(id => id !== targetUserId);
    if (requester) {
      requester.friendRequestsSent = (requester.friendRequestsSent || []).filter(id => id !== currentUser.id);
    }

    saveDB(db);

    socket.emit('friend:request_declined', { targetUserId });
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

  // Sending a message
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
      io.to(msgData.targetId).emit('message:new', newMessage);
    } else {
      const recipientSockets = userSocketsMap.get(msgData.targetId);
      if (recipientSockets) {
        recipientSockets.forEach(sId => {
          io.to(sId).emit('message:new', newMessage);
        });
      }
      const senderSockets = userSocketsMap.get(currentUser.id);
      if (senderSockets) {
        senderSockets.forEach(sId => {
          io.to(sId).emit('message:new', newMessage);
        });
      }
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
      const recipientSockets = userSocketsMap.get(targetId);
      if (recipientSockets) {
        recipientSockets.forEach(sId => {
          io.to(sId).emit('typing:display', payload);
        });
      }
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
      const recipientSockets = userSocketsMap.get(targetId);
      if (recipientSockets) {
        recipientSockets.forEach(sId => {
          io.to(sId).emit('typing:hide', payload);
        });
      }
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
      socketUserMap.delete(socket.id);
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
