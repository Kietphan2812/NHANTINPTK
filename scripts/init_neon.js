const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_8DevTZUmg4ja@ep-withered-meadow-b5o6uv6v-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function init() {
  console.log('Connecting to Neon PostgreSQL...');
  
  await pool.query(`
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
      last_seen TEXT,
      gender TEXT DEFAULT 'Nam',
      dob TEXT DEFAULT '28 tháng 12, 2004',
      cover TEXT,
      settings TEXT DEFAULT '{}'
    );

    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      creator_id TEXT,
      creator_name TEXT,
      avatar TEXT,
      description TEXT,
      members TEXT DEFAULT '[]',
      created_at BIGINT
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
      timestamp BIGINT NOT NULL,
      message_type TEXT DEFAULT 'normal',
      extra_data TEXT DEFAULT '{}'
    );

    CREATE TABLE IF NOT EXISTS friend_requests (
      id TEXT PRIMARY KEY,
      sender_id TEXT NOT NULL,
      receiver_id TEXT NOT NULL,
      created_at BIGINT NOT NULL,
      UNIQUE(sender_id, receiver_id)
    );
  `);

  console.log('✅ Tables created successfully in Neon PostgreSQL!');

  await pool.query(`
    INSERT INTO users (id, name, tag, username, phone, password, avatar, bio, friends, status, last_seen, gender, dob, cover, settings)
    VALUES 
    (
      'user_1792224901328_512', 'Phantaanskieetj', '@phantaanskieetj', 'phantaanskieetj', '0338351410', 'kiet12345',
      'https://res.cloudinary.com/qfgja134/image/upload/v1792309112/nhantin/chat_uploads/1792309111885-727576648_edeole.jpg',
      'Chào bạn, tôi vừa tham gia ZaloChat!', '[]', 'offline', '2026-10-18T08:15:01.328Z', 'Nam', '28 tháng 12, 2004',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', '{}'
    ),
    (
      'user_1792289794570_797', 'Xuân Nghi', '@xuannghi', 'xuannghi', '0911888999', '123',
      'https://api.dicebear.com/7.x/bottts/svg?seed=xuannghi',
      'Chào bạn, tôi vừa tham gia ZaloChat!', '[]', 'offline', '2026-10-18T02:16:34.571Z', 'Nữ', '15 tháng 06, 2005',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', '{}'
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      avatar = EXCLUDED.avatar,
      phone = EXCLUDED.phone,
      password = EXCLUDED.password;
  `);

  console.log('✅ Default users seeded into Neon PostgreSQL!');

  const res = await pool.query('SELECT id, name, phone, password, avatar FROM users');
  console.log('Current users in Neon:', res.rows);

  await pool.end();
}

init().catch(err => {
  console.error('INIT ERROR:', err);
  pool.end();
});
