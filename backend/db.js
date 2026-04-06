/*const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = pool;*/

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'kanban.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('DB error:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

module.exports = db;