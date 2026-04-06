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
});


/*const express = require("express");
const cors = require("cors");
const db = require('./db');
require("dotenv").config();

const app = express();
//const PORT = 5000;

const PORT = process.env.PORT || 5000;
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
});

app.use(cors());
app.use(express.json());

// Routes
app.use("/boards", require("./routes/boards"));
app.use("/columns", require("./routes/columns"));
app.use("/tasks", require("./routes/tasks"));

// Health
app.get("/health", (req, res) => {
  res.json({ status: "Backend is running 🚀" });
});

const issueRoutes = require("./routes/issues");
app.use("/issues", issueRoutes);*/
/*app.use("/users", require("./routes/users"));*/
/*app.use("/api/users", require("./routes/users"));
console.log("users route mounted at /api/users");*/


////



/*db.serialize(() => {
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
});*/
