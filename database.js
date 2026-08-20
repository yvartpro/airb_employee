const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

let db;

async function initDatabase() {
  if (db) {
    return db;
  }

  db = await open({
    filename: './airb.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      fullName TEXT,
      avatarUrl TEXT
    )
  `);

  console.log('Database initialized.');
  return db;
}

async function saveUser(user) {
  const database = await initDatabase();

  await database.run(
    `INSERT INTO users (id, email, fullName, avatarUrl)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       fullName = excluded.fullName,
       avatarUrl = excluded.avatarUrl`,
    [user.id, user.email, user.fullName, user.avatarUrl]
  );

  return user;
}

const getUsers = async () => {
  const database = await initDatabase();
  return await database.all('SELECT * FROM users');
};

const getUserById = async (id) => {
  const database = await initDatabase();
  return await database.get('SELECT * FROM users WHERE id = ?', [id]);
}

module.exports = {
  initDatabase,
  saveUser,
  getUsers,
  getUserById
};
