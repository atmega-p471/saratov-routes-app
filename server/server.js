const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Инициализация базы данных
const dbPath = path.join(__dirname, 'saratov.db');
const db = new sqlite3.Database(dbPath);

// Создание таблиц
db.serialize(() => {
  // Таблица мест
  db.run(`
    CREATE TABLE IF NOT EXISTS places (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      category TEXT NOT NULL,
      tags TEXT NOT NULL,
      rating REAL DEFAULT 0,
      photos TEXT,
      business_name TEXT,
      business_phone TEXT,
      business_website TEXT,
      business_hours TEXT,
      is_premium BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Таблица тегов
  db.run(`
    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      icon TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Таблица пользователей (для статистики)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      total_scanned INTEGER DEFAULT 0,
      routes_completed INTEGER DEFAULT 0,
      distance_walked REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Таблица коллекций пользователей
  db.run(`
    CREATE TABLE IF NOT EXISTS user_collections (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      place_id TEXT,
      scanned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (place_id) REFERENCES places (id)
    )
  `);
});

// API маршруты

// Получить все места
app.get('/api/places', (req, res) => {
  const { category, tags } = req.query;
  
  let query = 'SELECT * FROM places';
  let params = [];
  
  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }
  
  if (tags) {
    const tagList = tags.split(',');
    const tagConditions = tagList.map(() => 'tags LIKE ?').join(' OR ');
    query += category ? ' AND (' + tagConditions + ')' : ' WHERE (' + tagConditions + ')';
    tagList.forEach(tag => params.push(`%${tag}%`));
  }
  
  query += ' ORDER BY rating DESC';
  
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const places = rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      coordinates: [row.latitude, row.longitude],
      category: row.category,
      tags: JSON.parse(row.tags || '[]'),
      rating: row.rating,
      photos: JSON.parse(row.photos || '[]'),
      businessInfo: {
        name: row.business_name,
        phone: row.business_phone,
        website: row.business_website,
        workingHours: row.business_hours,
        isPremium: Boolean(row.is_premium)
      }
    }));
    
    res.json(places);
  });
});

// Получить все теги
app.get('/api/tags', (req, res) => {
  db.all('SELECT * FROM tags ORDER BY category, name', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Добавить место
app.post('/api/places', (req, res) => {
  const {
    id, name, description, coordinates, category, tags, rating,
    photos, businessInfo
  } = req.body;

  const query = `
    INSERT INTO places (
      id, name, description, latitude, longitude, category, tags, rating,
      photos, business_name, business_phone, business_website, 
      business_hours, is_premium
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    id, name, description, coordinates[0], coordinates[1], category,
    JSON.stringify(tags), rating || 0, JSON.stringify(photos || []),
    businessInfo?.name, businessInfo?.phone, businessInfo?.website,
    businessInfo?.workingHours, businessInfo?.isPremium ? 1 : 0
  ];

  db.run(query, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, success: true });
  });
});

// Обновить место
app.put('/api/places/:id', (req, res) => {
  const { id } = req.params;
  const {
    name, description, coordinates, category, tags, rating,
    photos, businessInfo
  } = req.body;

  const query = `
    UPDATE places SET
      name = ?, description = ?, latitude = ?, longitude = ?, category = ?,
      tags = ?, rating = ?, photos = ?, business_name = ?, business_phone = ?,
      business_website = ?, business_hours = ?, is_premium = ?
    WHERE id = ?
  `;

  const params = [
    name, description, coordinates[0], coordinates[1], category,
    JSON.stringify(tags), rating, JSON.stringify(photos || []),
    businessInfo?.name, businessInfo?.phone, businessInfo?.website,
    businessInfo?.workingHours, businessInfo?.isPremium ? 1 : 0, id
  ];

  db.run(query, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes, success: true });
  });
});

// Удалить место
app.delete('/api/places/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM places WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes, success: true });
  });
});

// Статистика пользователя
app.get('/api/users/:userId/stats', (req, res) => {
  const { userId } = req.params;
  
  db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.json({
      totalScanned: user.total_scanned,
      routesCompleted: user.routes_completed,
      distanceWalked: user.distance_walked
    });
  });
});

// Создать или обновить пользователя
app.post('/api/users/:userId/stats', (req, res) => {
  const { userId } = req.params;
  const { totalScanned, routesCompleted, distanceWalked } = req.body;
  
  const query = `
    INSERT OR REPLACE INTO users (id, total_scanned, routes_completed, distance_walked, updated_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
  `;
  
  db.run(query, [userId, totalScanned, routesCompleted, distanceWalked], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true });
  });
});

// Инициализация данных при первом запуске
const initializeData = () => {
  // Проверяем, есть ли уже данные
  db.get('SELECT COUNT(*) as count FROM places', (err, result) => {
    if (err || result.count > 0) return;
    
    // Добавляем теги
    const tagsData = [
      { id: 'gagarin', name: 'Гагарин', category: 'personalities', icon: '🚀' },
      { id: 'tabakov', name: 'Табаков', category: 'personalities', icon: '🎭' },
      { id: 'yankovsky', name: 'Янковский', category: 'personalities', icon: '🎬' },
      { id: 'chernyshevsky', name: 'Чернышевский', category: 'personalities', icon: '📚' },
      { id: 'architecture', name: 'Архитектура (модерн)', category: 'themes', icon: '🏛️' },
      { id: 'gastronomy', name: 'Гастрономия', category: 'themes', icon: '🍽️' },
      { id: 'art', name: 'Искусство', category: 'themes', icon: '🎨' },
      { id: 'space', name: 'Космос', category: 'themes', icon: '🌌' },
      { id: 'volga', name: 'Прогулки у Волги', category: 'themes', icon: '🌊' },
      { id: 'active', name: 'Активный', category: 'formats', icon: '🏃' },
      { id: 'leisurely', name: 'Неспешный', category: 'formats', icon: '🚶' },
      { id: 'children', name: 'Для детей', category: 'formats', icon: '👶' }
    ];
    
    tagsData.forEach(tag => {
      db.run('INSERT INTO tags (id, name, category, icon) VALUES (?, ?, ?, ?)',
        [tag.id, tag.name, tag.category, tag.icon]);
    });
    
    // Добавляем места
    const placesData = [
      {
        id: 'gagarin-park',
        name: 'Парк имени Гагарина',
        description: 'Центральный парк Саратова с памятником первому космонавту',
        latitude: 51.533562,
        longitude: 46.034266,
        category: 'attractions',
        tags: ['gagarin', 'space', 'children', 'leisurely'],
        rating: 4.5,
        business_name: 'Парк имени Гагарина',
        business_hours: 'Круглосуточно',
        is_premium: 0
      },
      {
        id: 'conservatory',
        name: 'Саратовская консерватория',
        description: 'Старейшая консерватория России, основанная в 1912 году',
        latitude: 51.533901,
        longitude: 46.008034,
        category: 'culture',
        tags: ['art', 'architecture', 'leisurely'],
        rating: 4.8,
        business_name: 'Саратовская государственная консерватория',
        business_phone: '+7 (8452) 26-66-09',
        business_website: 'https://sarcons.ru',
        business_hours: '9:00-18:00',
        is_premium: 1
      },
      {
        id: 'drama-theater',
        name: 'Театр драмы имени Слонова',
        description: 'Академический театр драмы, связанный с именами Табакова и Янковского',
        latitude: 51.531845,
        longitude: 46.005234,
        category: 'culture',
        tags: ['tabakov', 'yankovsky', 'art', 'leisurely'],
        rating: 4.7,
        business_name: 'Саратовский академический театр драмы',
        business_phone: '+7 (8452) 26-64-87',
        business_website: 'https://teatr-slonova.ru',
        business_hours: 'По расписанию спектаклей',
        is_premium: 1
      },
      {
        id: 'volga-embankment',
        name: 'Набережная Волги',
        description: 'Живописная набережная с видами на великую русскую реку',
        latitude: 51.533456,
        longitude: 46.042567,
        category: 'nature',
        tags: ['volga', 'active', 'leisurely', 'children'],
        rating: 4.6,
        business_name: 'Набережная Волги',
        business_hours: 'Круглосуточно',
        is_premium: 0
      },
      {
        id: 'restaurant-pushkin',
        name: 'Ресторан "Пушкинъ"',
        description: 'Изысканная русская кухня в историческом центре',
        latitude: 51.532567,
        longitude: 46.008901,
        category: 'gastronomy',
        tags: ['gastronomy', 'architecture', 'leisurely'],
        rating: 4.4,
        business_name: 'Ресторан "Пушкинъ"',
        business_phone: '+7 (8452) 75-75-75',
        business_website: 'https://pushkin-saratov.ru',
        business_hours: '12:00-24:00',
        is_premium: 1
      }
    ];
    
    placesData.forEach(place => {
      const query = `
        INSERT INTO places (
          id, name, description, latitude, longitude, category, tags, rating,
          business_name, business_phone, business_website, business_hours, is_premium
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.run(query, [
        place.id, place.name, place.description, place.latitude, place.longitude,
        place.category, JSON.stringify(place.tags), place.rating,
        place.business_name, place.business_phone, place.business_website,
        place.business_hours, place.is_premium
      ]);
    });
    
    console.log('✅ База данных инициализирована с тестовыми данными');
  });
};

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  initializeData();
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Ошибка при закрытии базы данных:', err.message);
    } else {
      console.log('База данных закрыта.');
    }
    process.exit(0);
  });
});
