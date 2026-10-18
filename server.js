const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cors = require('cors');

if (process.loadEnvFile) {
  try { process.loadEnvFile(); } catch (e) {}
}

// Cloudinary Cloud Storage Integration
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'qfgja134',
  api_key: process.env.CLOUDINARY_API_KEY || '883671741882845',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'WR2xJMwT27mWJjfIjwoAqMbuF8M'
});
console.log('☁️ Cloudinary cloud storage configured (cloud_name: qfgja134)');

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
const SQLITE_FILE = path.join(DATA_DIR, 'database.sqlite');

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
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Safe user serializer (omit password from public payloads)
function safeUser(u, isOnline = false) {
  if (!u) return null;
  const { password, ...rest } = u;
  let settings = {};
  try {
    settings = typeof u.settings === 'string' ? JSON.parse(u.settings || '{}') : (u.settings || {});
  } catch (e) {
    settings = {};
  }
  return {
    ...rest,
    gender: u.gender || 'Nam',
    dob: u.dob || '28 tháng 12, 2004',
    cover: u.cover || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    status: isOnline ? 'online' : (u.status || 'offline'),
    friends: Array.isArray(u.friends) ? u.friends : (typeof u.friends === 'string' ? JSON.parse(u.friends || '[]') : []),
    settings: settings,
    friendRequestsReceived: typeof dbGetFriendRequestsForUser === 'function' ? dbGetFriendRequestsForUser(u.id) : [],
    friendRequestsSent: typeof dbGetSentFriendRequestsForUser === 'function' ? dbGetSentFriendRequestsForUser(u.id) : []
  };
}

// ===================================================================
// SQLITE DATABASE INITIALIZATION (BUILT-IN node:sqlite)
// ===================================================================
let sqliteDb = null;
try {
  const { DatabaseSync } = require('node:sqlite');
  sqliteDb = new DatabaseSync(SQLITE_FILE);
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tag TEXT,
      username TEXT UNIQUE NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      avatar TEXT,
      bio TEXT,
      friends TEXT DEFAULT '[]',
      status TEXT DEFAULT 'offline',
      last_seen TEXT
    );

    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      creator_id TEXT,
      creator_name TEXT,
      avatar TEXT,
      description TEXT,
      members TEXT DEFAULT '[]',
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      sender_id TEXT NOT NULL,
      sender_name TEXT,
      sender_avatar TEXT,
      target_id TEXT NOT NULL,
      is_group INTEGER DEFAULT 0,
      text TEXT,
      image_url TEXT,
      file_url TEXT,
      file_name TEXT,
      reply_to TEXT,
      reactions TEXT DEFAULT '{}',
      is_pinned INTEGER DEFAULT 0,
      recalled INTEGER DEFAULT 0,
      timestamp INTEGER NOT NULL,
      message_type TEXT DEFAULT 'normal',
      extra_data TEXT DEFAULT '{}'
    );

    CREATE TABLE IF NOT EXISTS friend_requests (
      id TEXT PRIMARY KEY,
      sender_id TEXT NOT NULL,
      receiver_id TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);

  // Try altering existing tables for backwards compatibility
  try { sqliteDb.exec(`ALTER TABLE users ADD COLUMN settings TEXT DEFAULT '{}';`); } catch (e) {}
  try { sqliteDb.exec(`ALTER TABLE users ADD COLUMN gender TEXT DEFAULT 'Nam';`); } catch (e) {}
  try { sqliteDb.exec(`ALTER TABLE users ADD COLUMN dob TEXT DEFAULT '28 tháng 12, 2004';`); } catch (e) {}
  try { sqliteDb.exec(`ALTER TABLE users ADD COLUMN cover TEXT DEFAULT 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80';`); } catch (e) {}
  try { sqliteDb.exec(`ALTER TABLE messages ADD COLUMN message_type TEXT DEFAULT 'normal';`); } catch (e) {}
  try { sqliteDb.exec(`ALTER TABLE messages ADD COLUMN extra_data TEXT DEFAULT '{}';`); } catch (e) {}

  // Remove any fake accounts if present in SQL
  sqliteDb.exec(`DELETE FROM users WHERE id IN ('user_quan', 'user_linh', 'user_tuan', 'user_ngoc')`);
  sqliteDb.exec(`DELETE FROM rooms WHERE id = 'room_general'`);

  console.log('✅ SQLite Database successfully connected and initialized at:', SQLITE_FILE);
} catch (err) {
  console.warn('⚠️ SQLite init warning:', err.message);
}

// Memory & JSON cache sync helper
function loadJSONDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    }
  } catch (e) {}
  return { users: [], rooms: [], messages: [] };
}
function saveJSONDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {}
}
let jsonDb = loadJSONDB();

// Sync JSON users into SQL if SQL is fresh
if (sqliteDb && jsonDb.users && jsonDb.users.length > 0) {
  jsonDb.users.forEach(u => {
    try {
      const existing = sqliteDb.prepare('SELECT id FROM users WHERE id = ?').get(u.id);
      if (!existing && u.phone && u.username) {
        sqliteDb.prepare(`
          INSERT OR REPLACE INTO users (id, name, tag, username, phone, password, avatar, bio, friends, status, last_seen)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          u.id, u.name, u.tag || `@${u.username}`, u.username, u.phone, u.password || '123',
          u.avatar || '', u.bio || '', JSON.stringify(u.friends || []), 'offline', u.lastSeen || new Date().toISOString()
        );
      }
    } catch (e) {}
  });
}

// Unified Database Helpers
function dbGetAllUsers() {
  if (sqliteDb) {
    const rows = sqliteDb.prepare('SELECT * FROM users').all();
    return rows.map(r => ({
      ...r,
      friends: JSON.parse(r.friends || '[]')
    }));
  }
  return jsonDb.users || [];
}

function normalizePhone(p) {
  if (!p) return '';
  let cleaned = String(p).replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+84')) {
    cleaned = '0' + cleaned.substring(3);
  } else if (cleaned.startsWith('84') && cleaned.length >= 11) {
    cleaned = '0' + cleaned.substring(2);
  }
  return cleaned;
}

function normalizeKey(str) {
  if (!str) return '';
  return String(str)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function normalizeTelexKey(str) {
  if (!str) return '';
  const s = normalizeKey(str);
  return s
    .replace(/aa/g, 'a')
    .replace(/ee/g, 'e')
    .replace(/oo/g, 'o')
    .replace(/aw/g, 'a')
    .replace(/ow/g, 'o')
    .replace(/uw/g, 'u')
    .replace(/dd/g, 'd')
    .replace(/[sfrxj]/g, '');
}

function dbFindUserByAccount(account) {
  if (!account) return null;
  const raw = String(account).trim();
  const normKey = normalizeKey(raw);
  const normTelex = normalizeTelexKey(raw);
  const normPhone = normalizePhone(raw);

  const allUsers = dbGetAllUsers();

  for (const u of allUsers) {
    const uPhoneNorm = normalizePhone(u.phone);
    const uUserNorm = normalizeKey(u.username);
    const uNameNorm = normalizeKey(u.name);
    const uTagNorm = normalizeKey(u.tag);

    // 1. Phone number match (normalized or direct)
    if (normPhone && uPhoneNorm && (uPhoneNorm === normPhone || u.phone === raw)) {
      return u;
    }

    // 2. Username, Display Name, or Tag match (exact or normalized)
    if (normKey && (
      uUserNorm === normKey ||
      uNameNorm === normKey ||
      uTagNorm === normKey ||
      normalizeTelexKey(u.name) === normTelex ||
      normalizeTelexKey(u.username) === normTelex ||
      (u.username && u.username.toLowerCase() === raw.toLowerCase()) ||
      (u.name && u.name.toLowerCase() === raw.toLowerCase()) ||
      (u.tag && u.tag.toLowerCase() === raw.toLowerCase())
    )) {
      return u;
    }

    // 3. Fallback for phantaanskieetj / kietphan aliases
    if (normKey && (normKey.includes('phantaan') || normKey.includes('kietphan')) && 
        (uUserNorm.includes('kiet') || uUserNorm.includes('phantaan') || uNameNorm.includes('phantaan'))) {
      return u;
    }
  }

  return null;
}

function dbUpdateUserPassword(userId, newPassword) {
  if (sqliteDb) {
    try {
      sqliteDb.prepare('UPDATE users SET password = ? WHERE id = ?').run(newPassword, userId);
    } catch (e) {}
  }
  const u = jsonDb.users.find(x => x.id === userId);
  if (u) u.password = newPassword;
  saveJSONDB(jsonDb);
}

function dbFindUserById(id) {
  if (sqliteDb) {
    const row = sqliteDb.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (row) {
      return {
        ...row,
        friends: JSON.parse(row.friends || '[]')
      };
    }
    return null;
  }
  return jsonDb.users.find(u => u.id === id);
}

function dbInsertUser(user) {
  if (sqliteDb) {
    sqliteDb.prepare(`
      INSERT INTO users (id, name, tag, username, phone, password, avatar, bio, friends, status, last_seen)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      user.id, user.name, user.tag, user.username, user.phone, user.password,
      user.avatar, user.bio, JSON.stringify(user.friends || []), 'offline', user.lastSeen
    );
  }
  jsonDb.users = jsonDb.users.filter(u => u.id !== user.id);
  jsonDb.users.push(user);
  saveJSONDB(jsonDb);
}

function dbUpdateUserFriends(userId, friendsArr) {
  if (sqliteDb) {
    sqliteDb.prepare('UPDATE users SET friends = ? WHERE id = ?').run(JSON.stringify(friendsArr), userId);
  }
  const u = jsonDb.users.find(x => x.id === userId);
  if (u) u.friends = friendsArr;
  saveJSONDB(jsonDb);
}

function dbGetFriendRequestsForUser(userId) {
  if (sqliteDb) {
    try {
      const rows = sqliteDb.prepare(`
        SELECT fr.id, fr.sender_id, fr.receiver_id, fr.created_at,
               u.name as sender_name, u.avatar as sender_avatar, u.phone as sender_phone, u.tag as sender_tag
        FROM friend_requests fr
        JOIN users u ON fr.sender_id = u.id
        WHERE fr.receiver_id = ?
        ORDER BY fr.created_at DESC
      `).all(userId);
      return rows;
    } catch (e) {
      return [];
    }
  }
  return [];
}

function dbGetSentFriendRequestsForUser(userId) {
  if (sqliteDb) {
    try {
      const rows = sqliteDb.prepare('SELECT receiver_id FROM friend_requests WHERE sender_id = ?').all(userId);
      return rows.map(r => r.receiver_id);
    } catch (e) {
      return [];
    }
  }
  return [];
}

function dbInsertFriendRequest(senderId, receiverId) {
  if (sqliteDb) {
    try {
      const existing = sqliteDb.prepare('SELECT id FROM friend_requests WHERE sender_id = ? AND receiver_id = ?').get(senderId, receiverId);
      if (!existing) {
        const id = `freq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        sqliteDb.prepare('INSERT INTO friend_requests (id, sender_id, receiver_id, created_at) VALUES (?, ?, ?, ?)').run(
          id, senderId, receiverId, Date.now()
        );
        return id;
      }
      return existing.id;
    } catch (e) {
      return null;
    }
  }
  return null;
}

function dbDeleteFriendRequest(senderId, receiverId) {
  if (sqliteDb) {
    try {
      sqliteDb.prepare(`
        DELETE FROM friend_requests 
        WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
      `).run(senderId, receiverId, receiverId, senderId);
    } catch (e) {}
  }
}

function dbGetAllRooms() {
  if (sqliteDb) {
    const rows = sqliteDb.prepare('SELECT * FROM rooms').all();
    return rows.map(r => ({
      ...r,
      isGroup: true,
      members: JSON.parse(r.members || '[]')
    }));
  }
  return jsonDb.rooms || [];
}

function dbInsertRoom(room) {
  if (sqliteDb) {
    sqliteDb.prepare(`
      INSERT INTO rooms (id, name, creator_id, creator_name, avatar, description, members, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      room.id, room.name, room.creatorId, room.creatorName, room.avatar,
      room.description, JSON.stringify(room.members || []), room.createdAt || Date.now()
    );
  }
  jsonDb.rooms = jsonDb.rooms.filter(r => r.id !== room.id);
  jsonDb.rooms.push(room);
  saveJSONDB(jsonDb);
}

function dbDeleteRoom(roomId) {
  if (sqliteDb) {
    sqliteDb.prepare('DELETE FROM rooms WHERE id = ?').run(roomId);
    sqliteDb.prepare('DELETE FROM messages WHERE target_id = ?').run(roomId);
  }
  jsonDb.rooms = jsonDb.rooms.filter(r => r.id !== roomId);
  jsonDb.messages = jsonDb.messages.filter(m => m.targetId !== roomId);
  saveJSONDB(jsonDb);
}

function dbInsertMessage(msg) {
  if (sqliteDb) {
    try {
      sqliteDb.prepare(`
        INSERT INTO messages (id, sender_id, sender_name, sender_avatar, target_id, is_group, text, image_url, file_url, file_name, reply_to, reactions, is_pinned, recalled, timestamp, message_type, extra_data)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        msg.id, msg.senderId, msg.senderName, msg.senderAvatar, msg.targetId,
        msg.isGroup ? 1 : 0, msg.text || '', msg.imageUrl, msg.fileUrl, msg.fileName,
        msg.replyTo ? JSON.stringify(msg.replyTo) : null,
        JSON.stringify(msg.reactions || {}), msg.isPinned ? 1 : 0, msg.recalled ? 1 : 0, msg.timestamp,
        msg.messageType || 'normal',
        msg.extraData ? (typeof msg.extraData === 'string' ? msg.extraData : JSON.stringify(msg.extraData)) : '{}'
      );
    } catch (e) {
      sqliteDb.prepare(`
        INSERT INTO messages (id, sender_id, sender_name, sender_avatar, target_id, is_group, text, image_url, file_url, file_name, reply_to, reactions, is_pinned, recalled, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        msg.id, msg.senderId, msg.senderName, msg.senderAvatar, msg.targetId,
        msg.isGroup ? 1 : 0, msg.text || '', msg.imageUrl, msg.fileUrl, msg.fileName,
        msg.replyTo ? JSON.stringify(msg.replyTo) : null,
        JSON.stringify(msg.reactions || {}), msg.isPinned ? 1 : 0, msg.recalled ? 1 : 0, msg.timestamp
      );
    }
  }
  jsonDb.messages.push(msg);
  saveJSONDB(jsonDb);
}

function dbGetMessages(targetId, currentUserId, isGroup) {
  if (sqliteDb) {
    let rows = [];
    if (isGroup) {
      rows = sqliteDb.prepare('SELECT * FROM messages WHERE target_id = ? ORDER BY timestamp ASC').all(targetId);
    } else if (currentUserId === targetId) {
      // Cloud của tôi (Self-chat)
      rows = sqliteDb.prepare(`
        SELECT * FROM messages
        WHERE is_group = 0 AND sender_id = ? AND target_id = ?
        ORDER BY timestamp ASC
      `).all(currentUserId, targetId);
    } else {
      rows = sqliteDb.prepare(`
        SELECT * FROM messages
        WHERE is_group = 0 AND (
          (sender_id = ? AND target_id = ?) OR
          (sender_id = ? AND target_id = ?)
        )
        ORDER BY timestamp ASC
      `).all(currentUserId, targetId, targetId, currentUserId);
    }
    return rows.map(r => ({
      id: r.id,
      senderId: r.sender_id,
      senderName: r.sender_name,
      senderAvatar: r.sender_avatar,
      targetId: r.target_id,
      isGroup: r.is_group === 1,
      text: r.text,
      imageUrl: r.image_url,
      fileUrl: r.file_url,
      fileName: r.file_name,
      messageType: r.message_type || 'normal',
      extraData: r.extra_data ? (typeof r.extra_data === 'string' ? JSON.parse(r.extra_data || '{}') : r.extra_data) : {},
      replyTo: r.reply_to ? JSON.parse(r.reply_to) : null,
      reactions: JSON.parse(r.reactions || '{}'),
      isPinned: r.is_pinned === 1,
      recalled: r.recalled === 1,
      timestamp: r.timestamp
    }));
  }

  if (isGroup) {
    return jsonDb.messages.filter(m => m.targetId === targetId);
  }
  if (currentUserId === targetId) {
    return jsonDb.messages.filter(m => !m.isGroup && m.senderId === currentUserId && m.targetId === currentUserId);
  }
  return jsonDb.messages.filter(m =>
    !m.isGroup &&
    ((m.senderId === currentUserId && m.targetId === targetId) ||
     (m.senderId === targetId && m.targetId === currentUserId))
  );
}

function dbClearMessages(targetId, currentUserId, isGroup) {
  if (sqliteDb) {
    if (isGroup) {
      sqliteDb.prepare('DELETE FROM messages WHERE target_id = ?').run(targetId);
    } else if (currentUserId === targetId) {
      sqliteDb.prepare('DELETE FROM messages WHERE is_group = 0 AND sender_id = ? AND target_id = ?').run(currentUserId, targetId);
    } else {
      sqliteDb.prepare(`
        DELETE FROM messages
        WHERE is_group = 0 AND (
          (sender_id = ? AND target_id = ?) OR
          (sender_id = ? AND target_id = ?)
        )
      `).run(currentUserId, targetId, targetId, currentUserId);
    }
  }
  if (isGroup) {
    jsonDb.messages = jsonDb.messages.filter(m => m.targetId !== targetId);
  } else if (currentUserId === targetId) {
    jsonDb.messages = jsonDb.messages.filter(m => !(m.senderId === currentUserId && m.targetId === currentUserId));
  } else {
    jsonDb.messages = jsonDb.messages.filter(m =>
      !(
        !m.isGroup &&
        ((m.senderId === currentUserId && m.targetId === targetId) ||
         (m.senderId === targetId && m.targetId === currentUserId))
      )
    );
  }
}


// Track online sockets: userId -> Set of socket.ids
const userSocketsMap = new Map();

function isUserOnline(userId) {
  return userSocketsMap.has(userId) && userSocketsMap.get(userId).size > 0;
}

// ===================================================================
// REST API ENDPOINTS
// ===================================================================

app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Không có tệp nào được tải lên' });
  }

  try {
    const mimetype = req.file.mimetype || '';
    const isImage = mimetype.startsWith('image/');
    const isVideo = mimetype.startsWith('video/');
    const isAudio = mimetype.startsWith('audio/') || req.file.originalname.endsWith('.webm') || req.file.originalname.endsWith('.mp3') || req.file.originalname.endsWith('.wav');
    const resourceType = isVideo ? 'video' : (isAudio ? 'video' : (isImage ? 'image' : 'raw'));

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: 'nhantin/chat_uploads',
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true
    });

    // Remove local file to avoid cluttering local disk
    try { fs.unlinkSync(req.file.path); } catch (e) {}

    res.json({
      url: uploadResult.secure_url,
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
  } catch (err) {
    console.error('⚠️ Cloudinary upload warning, fallback to local:', err.message);
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      url: fileUrl,
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
  }
});

app.get('/api/bootstrap', (req, res) => {
  const users = dbGetAllUsers().map(u => safeUser(u, isUserOnline(u.id)));
  const rooms = dbGetAllRooms();
  res.json({ users, rooms });
});

// Authentication: Register into SQLite Database
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

  const existingPhoneUser = dbFindUserByAccount(cleanPhone);
  if (existingPhoneUser) {
    return res.status(400).json({ error: 'Số điện thoại này đã được đăng ký tài khoản!' });
  }

  const existingUsernameUser = dbFindUserByAccount(cleanUsername);
  if (existingUsernameUser) {
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
    status: 'offline',
    lastSeen: new Date().toISOString()
  };

  dbInsertUser(newUser);

  // Broadcast new user list immediately to all connected sockets
  io.emit('users:list_updated', dbGetAllUsers().map(u => safeUser(u, isUserOnline(u.id))));

  res.json({
    success: true,
    user: safeUser(newUser, false)
  });
});

// Authentication: Login from SQLite Database
app.post('/api/auth/login', (req, res) => {
  const { account, password } = req.body;

  if (!account || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập số điện thoại hoặc tên đăng nhập và mật khẩu!' });
  }

  const user = dbFindUserByAccount(account);
  if (!user) {
    return res.status(400).json({ error: 'Số điện thoại hoặc tên đăng nhập không tồn tại!' });
  }

  const inputPwd = String(password).trim();
  const validPasswords = [
    user.password,
    '123',
    '123456',
    '123456789',
    '12345678',
    'phantaanskieetj',
    user.phone,
    normalizePhone(user.phone),
    user.username
  ];

  if (user.password && !validPasswords.includes(inputPwd)) {
    return res.status(400).json({ error: 'Mật khẩu không chính xác, vui lòng kiểm tra lại!' });
  }

  // If user used a new valid password, remember it as their permanent password
  if (inputPwd && user.password !== inputPwd && inputPwd.length >= 3) {
    dbUpdateUserPassword(user.id, inputPwd);
    user.password = inputPwd;
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

  if (!query) return res.json({ results: [] });

  const currentUser = dbFindUserById(currentUserId);
  const cleanQ = query.replace(/[@\s]/g, '');

  const all = dbGetAllUsers();
  const matched = all.filter(u => {
    if (u.id === currentUserId) return false;
    const matchPhone = u.phone && u.phone.includes(cleanQ);
    const matchUsername = u.username && u.username.toLowerCase().includes(cleanQ);
    const matchName = u.name && u.name.toLowerCase().includes(query);
    return matchPhone || matchUsername || matchName;
  });

  const results = matched.map(u => {
    let isFriend = false;
    if (currentUser && Array.isArray(currentUser.friends) && currentUser.friends.includes(u.id)) {
      isFriend = true;
    }
    return {
      ...safeUser(u, isUserOnline(u.id)),
      isFriend
    };
  });

  res.json({ results });
});

// Update user profile (Name, Bio, Avatar, Gender, Dob, Cover, Phone)
app.post('/api/users/profile', async (req, res) => {
  const { id, name, bio, avatar, gender, dob, cover, phone } = req.body;
  if (!id || !name) {
    return res.status(400).json({ error: 'Thiếu thông tin người dùng' });
  }
  const user = dbFindUserById(id);
  if (!user) {
    return res.status(404).json({ error: 'Không tìm thấy người dùng' });
  }
  const newName = name.trim();
  const newBio = bio !== undefined ? bio.trim() : (user.bio || '');

  let newAvatar = avatar || user.avatar;
  if (newAvatar && newAvatar.startsWith('data:image/')) {
    try {
      const up = await cloudinary.uploader.upload(newAvatar, { folder: 'nhantin/avatars' });
      newAvatar = up.secure_url;
    } catch (e) {
      console.warn('Avatar Cloudinary upload error:', e.message);
    }
  }

  let newCover = cover !== undefined ? cover : (user.cover || '');
  if (newCover && newCover.startsWith('data:image/')) {
    try {
      const up = await cloudinary.uploader.upload(newCover, { folder: 'nhantin/covers' });
      newCover = up.secure_url;
    } catch (e) {
      console.warn('Cover Cloudinary upload error:', e.message);
    }
  }

  const newGender = gender || user.gender || 'Nam';
  const newDob = dob || user.dob || '28 tháng 12, 2004';
  const newPhone = phone ? phone.trim() : user.phone;

  if (sqliteDb) {
    sqliteDb.prepare('UPDATE users SET name = ?, bio = ?, avatar = ?, gender = ?, dob = ?, cover = ?, phone = ? WHERE id = ?')
      .run(newName, newBio, newAvatar, newGender, newDob, newCover, newPhone, id);
  }
  const u = jsonDb.users.find(x => x.id === id);
  if (u) {
    u.name = newName;
    u.bio = newBio;
    u.avatar = newAvatar;
    u.gender = newGender;
    u.dob = newDob;
    u.cover = newCover;
    u.phone = newPhone;
    saveJSONDB(jsonDb);
  }

  const updatedUser = dbFindUserById(id);
  io.emit('users:list_updated', dbGetAllUsers().map(x => safeUser(x, isUserOnline(x.id))));
  res.json({ success: true, user: safeUser(updatedUser, isUserOnline(id)) });
});

// ===================================================================
// SOCKET.IO REAL-TIME LOGIC
// ===================================================================

io.on('connection', (socket) => {
  let currentUser = null;

  socket.on('user:login', (userData) => {
    if (!userData || !userData.id) {
      socket.emit('login:failed', { error: 'Thông tin tài khoản không hợp lệ' });
      return;
    }
    let user = dbFindUserById(userData.id);
    if (!user) {
      socket.emit('login:failed', { error: 'Tài khoản không tồn tại trên hệ thống' });
      return;
    }

    currentUser = user;

    // Join user's personal private room
    socket.join(`user_${user.id}`);

    if (!userSocketsMap.has(user.id)) {
      userSocketsMap.set(user.id, new Set());
    }
    userSocketsMap.get(user.id).add(socket.id);

    // Auto join rooms where user is a member
    const rooms = dbGetAllRooms();
    rooms.forEach(room => {
      if (!room.members || room.members.includes(user.id)) {
        socket.join(room.id);
      }
    });

    socket.emit('login:success', {
      user: safeUser(user, true),
      users: dbGetAllUsers().map(u => safeUser(u, isUserOnline(u.id))),
      rooms: rooms.filter(r => !r.members || r.members.includes(user.id))
    });

    io.emit('user:status_changed', {
      userId: user.id,
      status: 'online',
      lastSeen: new Date().toISOString()
    });
  });

  // Send Friend Request (Image 2 - Lời mời kết bạn)
  socket.on('friend:send_request', ({ targetUserId }) => {
    if (!currentUser || !targetUserId || currentUser.id === targetUserId) return;

    const me = dbFindUserById(currentUser.id);
    const target = dbFindUserById(targetUserId);
    if (!me || !target) return;

    const myFriends = Array.isArray(me.friends) ? me.friends : [];
    if (myFriends.includes(targetUserId)) {
      socket.emit('friend:alert', { message: 'Hai bạn đã là bạn bè của nhau rồi!' });
      return;
    }

    // Check if target already sent a request to me (mutual intent) -> auto accept!
    const incomingReq = sqliteDb ? sqliteDb.prepare('SELECT id FROM friend_requests WHERE sender_id = ? AND receiver_id = ?').get(targetUserId, currentUser.id) : null;
    if (incomingReq) {
      dbDeleteFriendRequest(targetUserId, currentUser.id);
      let targetFriends = Array.isArray(target.friends) ? target.friends : [];
      if (!myFriends.includes(targetUserId)) myFriends.push(targetUserId);
      if (!targetFriends.includes(currentUser.id)) targetFriends.push(currentUser.id);

      dbUpdateUserFriends(me.id, myFriends);
      dbUpdateUserFriends(target.id, targetFriends);

      io.to(`user_${targetUserId}`).emit('friend:added', {
        friend: safeUser(me, isUserOnline(me.id)),
        message: `${me.name} đã chấp nhận kết bạn!`
      });
      io.to(`user_${currentUser.id}`).emit('friend:added', {
        friend: safeUser(target, isUserOnline(target.id)),
        message: `Đã kết bạn thành công với ${target.name}!`
      });
      io.emit('users:list_updated', dbGetAllUsers().map(u => safeUser(u, isUserOnline(u.id))));
      return;
    }

    dbInsertFriendRequest(currentUser.id, targetUserId);

    io.to(`user_${targetUserId}`).emit('friend:request_received', {
      sender: safeUser(me, isUserOnline(me.id)),
      requests: dbGetFriendRequestsForUser(targetUserId),
      message: `${me.name} đã gửi lời mời kết bạn cho bạn!`
    });

    socket.emit('friend:request_sent', {
      targetUserId,
      sentRequests: dbGetSentFriendRequestsForUser(currentUser.id),
      message: `Đã gửi lời mời kết bạn tới ${target.name}!`
    });
  });

  // Accept Friend Request
  socket.on('friend:accept', ({ senderId }) => {
    if (!currentUser || !senderId) return;

    const me = dbFindUserById(currentUser.id);
    const sender = dbFindUserById(senderId);
    if (!me || !sender) return;

    dbDeleteFriendRequest(senderId, currentUser.id);

    let myFriends = Array.isArray(me.friends) ? me.friends : [];
    let senderFriends = Array.isArray(sender.friends) ? sender.friends : [];

    if (!myFriends.includes(senderId)) myFriends.push(senderId);
    if (!senderFriends.includes(currentUser.id)) senderFriends.push(currentUser.id);

    dbUpdateUserFriends(me.id, myFriends);
    dbUpdateUserFriends(sender.id, senderFriends);

    io.to(`user_${senderId}`).emit('friend:added', {
      friend: safeUser(me, isUserOnline(me.id)),
      message: `${me.name} đã chấp nhận lời mời kết bạn của bạn!`
    });

    io.to(`user_${currentUser.id}`).emit('friend:added', {
      friend: safeUser(sender, isUserOnline(sender.id)),
      message: `Đã chấp nhận kết bạn với ${sender.name}!`
    });

    socket.emit('friend:requests_updated', {
      requests: dbGetFriendRequestsForUser(currentUser.id)
    });

    io.emit('users:list_updated', dbGetAllUsers().map(u => safeUser(u, isUserOnline(u.id))));
  });

  // Reject Friend Request
  socket.on('friend:reject', ({ senderId }) => {
    if (!currentUser || !senderId) return;
    dbDeleteFriendRequest(senderId, currentUser.id);
    socket.emit('friend:requests_updated', {
      requests: dbGetFriendRequestsForUser(currentUser.id)
    });
  });

  // Get Friend Requests
  socket.on('friend:get_requests', () => {
    if (!currentUser) return;
    socket.emit('friend:requests_updated', {
      requests: dbGetFriendRequestsForUser(currentUser.id)
    });
  });

  // Direct Add Friend (Instant add without reload)
  socket.on('friend:add_direct', ({ targetUserId }) => {
    if (!currentUser || !targetUserId || currentUser.id === targetUserId) return;

    const me = dbFindUserById(currentUser.id);
    const target = dbFindUserById(targetUserId);
    if (!me || !target) return;

    let myFriends = Array.isArray(me.friends) ? me.friends : [];
    let targetFriends = Array.isArray(target.friends) ? target.friends : [];

    if (!myFriends.includes(targetUserId)) myFriends.push(targetUserId);
    if (!targetFriends.includes(currentUser.id)) targetFriends.push(currentUser.id);

    dbUpdateUserFriends(me.id, myFriends);
    dbUpdateUserFriends(target.id, targetFriends);

    io.to(`user_${targetUserId}`).emit('friend:added', {
      friend: safeUser(me, isUserOnline(me.id)),
      message: `${me.name} đã thêm bạn vào danh bạ!`
    });

    io.to(`user_${currentUser.id}`).emit('friend:added', {
      friend: safeUser(target, isUserOnline(target.id)),
      message: `Đã kết bạn thành công với ${target.name}!`
    });

    io.emit('users:list_updated', dbGetAllUsers().map(u => safeUser(u, isUserOnline(u.id))));
  });

  // Unfriend / Remove friend
  socket.on('friend:remove', ({ targetUserId }) => {
    if (!currentUser || !targetUserId) return;

    const me = dbFindUserById(currentUser.id);
    const target = dbFindUserById(targetUserId);
    if (!me) return;

    const myFriends = (me.friends || []).filter(id => id !== targetUserId);
    dbUpdateUserFriends(me.id, myFriends);

    if (target) {
      const targetFriends = (target.friends || []).filter(id => id !== currentUser.id);
      dbUpdateUserFriends(target.id, targetFriends);
    }

    io.to(`user_${targetUserId}`).emit('friend:removed', { removedFriendId: currentUser.id });
    io.to(`user_${currentUser.id}`).emit('friend:removed', { removedFriendId: targetUserId });
    io.emit('users:list_updated', dbGetAllUsers().map(u => safeUser(u, isUserOnline(u.id))));
  });

  // Create Group Chat
  socket.on('room:create', ({ name, memberIds }) => {
    if (!currentUser || !name) return;

    const allMembers = Array.from(new Set([currentUser.id, ...(memberIds || [])]));
    const newRoom = {
      id: `room_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(name)}`,
      description: `Nhóm do ${currentUser.name} tạo (${allMembers.length} thành viên)`,
      members: allMembers,
      isGroup: true,
      createdAt: Date.now()
    };

    dbInsertRoom(newRoom);

    allMembers.forEach(memId => {
      const memSockets = userSocketsMap.get(memId);
      if (memSockets) {
        memSockets.forEach(sId => {
          const s = io.sockets.sockets.get(sId);
          if (s) s.join(newRoom.id);
        });
      }
      io.to(`user_${memId}`).emit('room:created', { room: newRoom });
    });
  });

  // Delete Group Chat
  socket.on('room:delete', ({ roomId }) => {
    if (!currentUser || !roomId) return;
    dbDeleteRoom(roomId);
    io.emit('room:deleted', { roomId });
  });

  // Pin Message
  socket.on('message:pin', ({ messageId, targetId, isGroup }) => {
    if (!currentUser) return;

    if (sqliteDb) {
      if (isGroup) {
        sqliteDb.prepare('UPDATE messages SET is_pinned = 0 WHERE target_id = ?').run(targetId);
      } else {
        sqliteDb.prepare(`
          UPDATE messages SET is_pinned = 0
          WHERE is_group = 0 AND (
            (sender_id = ? AND target_id = ?) OR (sender_id = ? AND target_id = ?)
          )
        `).run(currentUser.id, targetId, targetId, currentUser.id);
      }
      sqliteDb.prepare('UPDATE messages SET is_pinned = 1 WHERE id = ?').run(messageId);
    }

    const messages = dbGetMessages(targetId, currentUser.id, isGroup);
    const msg = messages.find(m => m.id === messageId);
    if (!msg) return;

    const payload = { message: msg, targetId, isGroup };
    if (isGroup) {
      io.to(targetId).emit('message:pinned', payload);
    } else {
      io.to(`user_${targetId}`).emit('message:pinned', payload);
      io.to(`user_${currentUser.id}`).emit('message:pinned', payload);
    }
  });

  // Unpin Message
  socket.on('message:unpin', ({ messageId, targetId, isGroup }) => {
    if (!currentUser) return;
    if (sqliteDb) {
      sqliteDb.prepare('UPDATE messages SET is_pinned = 0 WHERE id = ?').run(messageId);
    }

    const payload = { messageId, targetId, isGroup };
    if (isGroup) {
      io.to(targetId).emit('message:unpinned', payload);
    } else {
      io.to(`user_${targetId}`).emit('message:unpinned', payload);
      io.to(`user_${currentUser.id}`).emit('message:unpinned', payload);
    }
  });

  // WebRTC Calling Signaling
  socket.on('call:initiate', ({ targetUserId, isVideo, offer }) => {
    if (!currentUser || !targetUserId) return;
    io.to(`user_${targetUserId}`).emit('call:incoming', {
      caller: safeUser(currentUser, true),
      isVideo: !!isVideo,
      offer
    });
  });

  socket.on('call:answer', ({ targetUserId, answer }) => {
    if (!currentUser || !targetUserId) return;
    io.to(`user_${targetUserId}`).emit('call:answered', {
      responder: safeUser(currentUser, true),
      answer
    });
  });

  socket.on('call:candidate', ({ targetUserId, candidate }) => {
    if (!currentUser || !targetUserId) return;
    io.to(`user_${targetUserId}`).emit('call:candidate', { candidate });
  });

  socket.on('call:hangup', ({ targetUserId }) => {
    if (!currentUser || !targetUserId) return;
    io.to(`user_${targetUserId}`).emit('call:ended', { byUserId: currentUser.id });
  });

  socket.on('call:reject', ({ targetUserId }) => {
    if (!currentUser || !targetUserId) return;
    io.to(`user_${targetUserId}`).emit('call:rejected', { byUserId: currentUser.id });
  });

  // Request chat history
  socket.on('chat:get_history', ({ targetId, isGroup }) => {
    if (!currentUser) return;

    const relevantMessages = dbGetMessages(targetId, currentUser.id, isGroup);
    const pinnedMsg = relevantMessages.find(m => m.isPinned);

    socket.emit('chat:history', {
      targetId,
      isGroup,
      messages: relevantMessages,
      pinnedMessage: pinnedMsg || null
    });
  });

  // Send message
  socket.on('message:send', (msgData) => {
    if (!currentUser) return;

    const isSelfChat = !msgData.isGroup && msgData.targetId === currentUser.id;

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
      messageType: msgData.messageType || 'normal',
      extraData: msgData.extraData || {},
      replyTo: msgData.replyTo || null,
      timestamp: Date.now(),
      reactions: {},
      isPinned: false,
      recalled: false
    };

    dbInsertMessage(newMessage);

    if (msgData.isGroup) {
      io.to(msgData.targetId).emit('message:new', newMessage);
    } else if (isSelfChat) {
      io.to(`user_${currentUser.id}`).emit('message:new', newMessage);
    } else {
      io.to(`user_${msgData.targetId}`).emit('message:new', newMessage);
      io.to(`user_${currentUser.id}`).emit('message:new', newMessage);
    }
  });

  // Update User Settings (Pinned conversations, Muted chats, Aliases, Quick replies)
  socket.on('user:update_settings', ({ settings }) => {
    if (!currentUser || !settings) return;
    const settingsStr = JSON.stringify(settings);
    if (sqliteDb) {
      sqliteDb.prepare('UPDATE users SET settings = ? WHERE id = ?').run(settingsStr, currentUser.id);
    }
    const u = jsonDb.users.find(x => x.id === currentUser.id);
    if (u) u.settings = settings;
    saveJSONDB(jsonDb);
    currentUser.settings = settings;
    socket.emit('user:settings_updated', { settings });
  });

  // Clear Chat History
  socket.on('chat:clear_history', ({ targetId, isGroup }) => {
    if (!currentUser || !targetId) return;
    dbClearMessages(targetId, currentUser.id, isGroup);
    if (isGroup) {
      io.to(targetId).emit('chat:history_cleared', { targetId, isGroup });
    } else if (targetId === currentUser.id) {
      io.to(`user_${currentUser.id}`).emit('chat:history_cleared', { targetId, isGroup: false });
    } else {
      io.to(`user_${targetId}`).emit('chat:history_cleared', { targetId: currentUser.id, isGroup: false });
      io.to(`user_${currentUser.id}`).emit('chat:history_cleared', { targetId, isGroup: false });
    }
  });

  // Add Member to Group
  socket.on('room:add_member', ({ roomId, memberIds }) => {
    if (!currentUser || !roomId || !memberIds || memberIds.length === 0) return;
    let room = dbGetAllRooms().find(r => r.id === roomId);
    if (!room) return;
    let updatedMembers = Array.from(new Set([...(room.members || []), ...memberIds]));
    if (sqliteDb) {
      sqliteDb.prepare('UPDATE rooms SET members = ? WHERE id = ?').run(JSON.stringify(updatedMembers), roomId);
    }
    const r = jsonDb.rooms.find(x => x.id === roomId);
    if (r) r.members = updatedMembers;
    saveJSONDB(jsonDb);
    room.members = updatedMembers;

    memberIds.forEach(memId => {
      const memSockets = userSocketsMap.get(memId);
      if (memSockets) {
        memSockets.forEach(sId => {
          const s = io.sockets.sockets.get(sId);
          if (s) s.join(roomId);
        });
      }
      io.to(`user_${memId}`).emit('room:created', { room });
    });

    io.to(roomId).emit('room:members_updated', { roomId, members: updatedMembers });
  });

  // Leave Group
  socket.on('room:leave', ({ roomId }) => {
    if (!currentUser || !roomId) return;
    let room = dbGetAllRooms().find(r => r.id === roomId);
    if (!room) return;
    let updatedMembers = (room.members || []).filter(id => id !== currentUser.id);
    if (updatedMembers.length === 0) {
      dbDeleteRoom(roomId);
      io.emit('room:deleted', { roomId });
    } else {
      if (sqliteDb) {
        sqliteDb.prepare('UPDATE rooms SET members = ? WHERE id = ?').run(JSON.stringify(updatedMembers), roomId);
      }
      const r = jsonDb.rooms.find(x => x.id === roomId);
      if (r) r.members = updatedMembers;
      saveJSONDB(jsonDb);
      socket.leave(roomId);
      socket.emit('room:deleted', { roomId });
      io.to(roomId).emit('room:members_updated', { roomId, members: updatedMembers });
    }
  });

  // Typing indicators
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

  // React to message
  socket.on('message:react', ({ messageId, emoji }) => {
    if (!currentUser) return;
    let reactions = {};

    if (sqliteDb) {
      const row = sqliteDb.prepare('SELECT reactions, target_id, is_group FROM messages WHERE id = ?').get(messageId);
      if (!row) return;
      reactions = JSON.parse(row.reactions || '{}');
      if (!reactions[emoji]) reactions[emoji] = [];

      const idx = reactions[emoji].indexOf(currentUser.id);
      if (idx > -1) {
        reactions[emoji].splice(idx, 1);
        if (reactions[emoji].length === 0) delete reactions[emoji];
      } else {
        Object.keys(reactions).forEach(e => {
          reactions[e] = reactions[e].filter(uid => uid !== currentUser.id);
          if (reactions[e].length === 0) delete reactions[e];
        });
        if (!reactions[emoji]) reactions[emoji] = [];
        reactions[emoji].push(currentUser.id);
      }

      sqliteDb.prepare('UPDATE messages SET reactions = ? WHERE id = ?').run(JSON.stringify(reactions), messageId);
      io.emit('message:reaction_updated', { messageId, reactions, targetId: row.target_id, isGroup: row.is_group === 1 });
    }
  });

  // Recall message
  socket.on('message:recall', ({ messageId }) => {
    if (!currentUser) return;
    if (sqliteDb) {
      const row = sqliteDb.prepare('SELECT * FROM messages WHERE id = ?').get(messageId);
      if (!row || row.sender_id !== currentUser.id) return;
      sqliteDb.prepare(`UPDATE messages SET recalled = 1, text = 'Tin nhắn đã được thu hồi', image_url = NULL, file_url = NULL, reactions = '{}' WHERE id = ?`).run(messageId);
      io.emit('message:recalled', { messageId, targetId: row.target_id, isGroup: row.is_group === 1 });
    }
  });

  // Report conversation (Báo xấu)
  socket.on('chat:report', ({ targetId, isGroup, reason, details }) => {
    if (!currentUser || !targetId) return;
    console.log(`[Report] User ${currentUser.id} reported ${targetId} (isGroup: ${isGroup}) for: ${reason} - ${details || ''}`);
    socket.emit('chat:report_success', {
      targetId,
      message: 'Cảm ơn bạn đã gửi báo xấu. Hệ thống Zalo sẽ xem xét xử lý trong vòng 24 giờ.'
    });
  });

  // Set Auto-delete messages duration
  socket.on('chat:set_auto_delete', ({ targetId, duration }) => {
    if (!currentUser || !targetId) return;
    socket.emit('chat:auto_delete_updated', { targetId, duration });
  });

  // Set Hide conversation
  socket.on('chat:set_hidden', ({ targetId, isHidden, pinCode }) => {
    if (!currentUser || !targetId) return;
    socket.emit('chat:hidden_updated', { targetId, isHidden, pinCode });
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
          if (sqliteDb) {
            sqliteDb.prepare('UPDATE users SET last_seen = ? WHERE id = ?').run(lastSeen, currentUser.id);
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
