const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const DB_DIR = path.join(__dirname, '..', 'dados');
const DB_PATH = path.join(DB_DIR, 'integration.db');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

let db = null; // instância interna do SQL.js

function persistDatabase() {
  if (db) {
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  }
}

async function initDatabase() {
  const SQL = await initSqlJs();
  let dbData;
  if (fs.existsSync(DB_PATH)) {
    dbData = fs.readFileSync(DB_PATH);
  }
  db = new SQL.Database(dbData);
  // Cria tabela se não existir
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      gender TEXT,
      dob TEXT,
      age INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);
  if (!dbData) {
    persistDatabase();
  }

  // Retorna um objeto wrapper com os métodos que o processor espera
  return {
    getUserByEmail: async (email) => {
      const result = db.exec("SELECT email FROM users WHERE email = ?", [email]);
      if (result.length && result[0].values.length) {
        return { email: result[0].values[0][0] };
      }
      return undefined;
    },
    insertUser: async (user) => {
      const { email, first_name, last_name, gender, dob, age } = user;
      db.run(
        `INSERT INTO users (email, first_name, last_name, gender, dob, age, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
        [email, first_name, last_name, gender, dob, age]
      );
      persistDatabase();
    },
    updateUser: async (user) => {
      const { email, first_name, last_name, gender, dob, age } = user;
      db.run(
        `UPDATE users
         SET first_name = ?, last_name = ?, gender = ?, dob = ?, age = ?, updated_at = datetime('now')
         WHERE email = ?`,
        [first_name, last_name, gender, dob, age, email]
      );
      persistDatabase();
    },
    close: async () => {
      if (db) persistDatabase();
      db = null;
    }
  };
}

module.exports = { initDatabase };