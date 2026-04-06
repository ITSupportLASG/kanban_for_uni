/*const router = require("express").Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, email, role FROM users ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;*/

/*router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, email, role FROM users ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});*/

/*router.get("/", async (req, res) => {
  console.log("GET /api/users hit");
  try {
    const result = await db.query(
      "SELECT id, name, email, role FROM users ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});*/

const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all users
router.get('/', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      console.error('Error fetching users:', err.message);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    res.json(rows);
  });
});

module.exports = router;

module.exports = router;
console.log("users route file loaded");