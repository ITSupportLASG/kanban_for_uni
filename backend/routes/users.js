/*const express = require("express");
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
console.log("users route file loaded");*/

const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all users
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, email FROM users ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});
// Add new user
router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    const result = await db.query(
      `
      INSERT INTO users (name, email)
      VALUES ($1, $2)
      RETURNING *
      `,
      [name.trim(), email?.trim() || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Add user error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;