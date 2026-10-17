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

// Initial seed data
const initialData = {
  users: [
    {
      id: 'user_quan',
      name: 'Minh Quân',
      tag: '@minhquan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Lập trình viên • Thích công nghệ & Cà phê ☕',
      status: 'offline',
      lastSeen: new Date().toISOString()
    },
    {
      id: 'user_linh',
      name: 'Hà Linh',
      tag: '@halinh',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      bio: 'UI/UX Designer • Yêu âm nhạc & Du lịch 🎧✈️',
      status: 'offline',
      lastSeen: new Date().toISOString()
    },
    {
      id: 'user_tuan',
      name: 'Tuấn Anh',
      tag: '@tuananh',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'Photographer & Gamer 🎮📷',
      status: 'offline',
      lastSeen: new Date().toISOString()
    },
    {
      id: 'user_ngoc',
      name: 'Bảo Ngọc',
      tag: '@baongoc',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      bio: 'Content Creator • Yêu mèo 🐱✨',
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
function loadDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return JSON.parse(JSON.stringify(initialData));
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading db:', err);
    return JSON.parse(JSON.stringify(initialData));
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

// API endpoint for uploading images/attachments
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    url: fileUrl,
    filename: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size
  });
});

// API endpoint to get initial state
app.get('/api/bootstrap', (req, res) => {
  const onlineUserIds = Array.from(userSocketsMap.keys());
  const usersWithStatus = db.users.map(u => ({
    ...u,
    status: onlineUserIds.includes(u.id) ? 'online' : 'offline'
  }));
  res.json({
    users: usersWithStatus,
    rooms: db.rooms
  });
});

// Socket.io handlers
io.on('connection', (socket) => {
  let currentUser = null;

  // User registers or logs in
  socket.on('user:login', (userData) => {
    let user = db.users.find(u => u.id === userData.id);
    if (!user) {
      // Create new user if not exists
      user = {
        id: userData.id || `user_${Date.now()}`,
        name: userData.name || 'Người dùng mới',
        tag: `@${(userData.name || 'user').toLowerCase().replace(/\s+/g, '')}`,
        avatar: userData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userData.name || 'user')}`,
        bio: userData.bio || 'Chào bạn, tôi vừa tham gia!',
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

    // Notify user of successful login
    socket.emit('login:success', {
      user: { ...user, status: 'online' },
      users: db.users.map(u => ({
        ...u,
        status: userSocketsMap.has(u.id) && userSocketsMap.get(u.id).size > 0 ? 'online' : 'offline'
      })),
      rooms: db.rooms
    });

    // Broadcast user presence change to all clients
    io.emit('user:status_changed', {
      userId: user.id,
      status: 'online',
      lastSeen: new Date().toISOString()
    });
  });

  // Request chat history between current user and target (user or room)
  socket.on('chat:get_history', ({ targetId, isGroup }) => {
    if (!currentUser) return;

    let relevantMessages = [];
    if (isGroup) {
      relevantMessages = db.messages.filter(m => m.targetId === targetId);
    } else {
      // 1-on-1 private chat
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
      // Emit to room
      io.to(msgData.targetId).emit('message:new', newMessage);
    } else {
      // Emit to recipient's sockets
      const recipientSockets = userSocketsMap.get(msgData.targetId);
      if (recipientSockets) {
        recipientSockets.forEach(sId => {
          io.to(sId).emit('message:new', newMessage);
        });
      }
      // Also emit back to all of sender's sockets (so multiple tabs are in sync)
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

  // React to a message (❤️, 😂, 👍, etc.)
  socket.on('message:react', ({ messageId, emoji }) => {
    if (!currentUser) return;
    const msg = db.messages.find(m => m.id === messageId);
    if (!msg) return;

    if (!msg.reactions) msg.reactions = {};
    if (!msg.reactions[emoji]) msg.reactions[emoji] = [];

    const index = msg.reactions[emoji].indexOf(currentUser.id);
    if (index > -1) {
      // Remove reaction if already reacted
      msg.reactions[emoji].splice(index, 1);
      if (msg.reactions[emoji].length === 0) delete msg.reactions[emoji];
    } else {
      // Remove previous reactions by this user for other emojis (single reaction like Messenger)
      Object.keys(msg.reactions).forEach(e => {
        msg.reactions[e] = msg.reactions[e].filter(uid => uid !== currentUser.id);
        if (msg.reactions[e].length === 0) delete msg.reactions[e];
      });
      // Add current reaction
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

  // Recall message (Thu hồi tin nhắn)
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

// Fallback for SPA - serve index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Chat app running at http://localhost:${PORT}`);
});
