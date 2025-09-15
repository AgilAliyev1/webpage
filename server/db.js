const path = require('path');
const Database = require('better-sqlite3');

let db;

function getDb() {
  if (db) return db;
  const dbPath = path.join(__dirname, 'data.db');
  db = new Database(dbPath);

  db.exec(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS experiences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      organization TEXT NOT NULL,
      location TEXT NOT NULL,
      type TEXT NOT NULL, -- 'volunteer' | 'internship'
      description TEXT NOT NULL,
      tags TEXT, -- comma-separated
      created_by INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  return db;
}

module.exports = { getDb };


