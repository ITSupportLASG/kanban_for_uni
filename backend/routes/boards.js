/*const router = require("express").Router();
const pool = require("../db");

// 1) Get all boards
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, title, user_id, created_at FROM boards ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch boards" });
  }
});

router.post("/", (req, res) => {
  const { name } = req.body;

  db.run(
    "INSERT INTO boards (name) VALUES (?)",
    [name],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, name });
    }
  );
});*/
const router = require("express").Router();
const pool = require("../db");

// Get all boards
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name FROM boards ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch boards:", err.message);
    res.status(500).json({ error: "Failed to fetch boards" });
  }
});

// Create a new board
router.post("/", async (req, res) => {
  const { name } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO boards (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to create board:", err.message);
    res.status(500).json({ error: "Failed to create board" });
  }
});

module.exports = router;
