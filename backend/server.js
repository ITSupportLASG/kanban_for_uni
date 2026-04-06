/*const express = require("express");
const cors = require("cors");
const db = require("./db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/boards", require("./routes/boards"));
app.use("/columns", require("./routes/columns"));
app.use("/tasks", require("./routes/tasks"));
app.use("/issues", require("./routes/issues"));
app.use("/api/users", require("./routes/users"));

app.get("/health", (req, res) => {
  res.json({ status: "Backend is running 🚀" });
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS boards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS columns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      board_id INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      status TEXT,
      column_id INTEGER,
      assigned_to INTEGER
    )
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});*/

const express = require("express");
const cors = require("cors");
const db = require("./db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/boards", require("./routes/boards"));
app.use("/columns", require("./routes/columns"));
app.use("/tasks", require("./routes/tasks"));
app.use("/issues", require("./routes/issues"));
app.use("/api/users", require("./routes/users"));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Backend is running 🚀" });
});

async function initDb() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS boards (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS columns (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE,
        position INTEGER DEFAULT 0
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        column_id INTEGER REFERENCES columns(id) ON DELETE CASCADE,
        position INTEGER DEFAULT 0,
        assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    console.log("PostgreSQL tables ready");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("DB init error:", err.message);
    process.exit(1);
  }
}

initDb();

