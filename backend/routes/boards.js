const router = require("express").Router();
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

// 2) Create a board (+ create default columns)
/*router.post("/", async (req, res) => {
  const { title, user_id } = req.body;

  if (!title || !user_id) {
    return res.status(400).json({ error: "title and user_id are required" });
  }

  try {
    // Create board
    const boardResult = await pool.query(
      "INSERT INTO boards (title, user_id) VALUES ($1, $2) RETURNING *",
      [title, user_id]
    );

    const board = boardResult.rows[0];

    // Create default columns
    const defaultColumns = ["To Do", "In Progress", "Done"];
    for (let i = 0; i < defaultColumns.length; i++) {
      await pool.query(
        "INSERT INTO columns (title, board_id, position) VALUES ($1, $2, $3)",
        [defaultColumns[i], board.id, i + 1]
      );
    }

    res.status(201).json(board);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create board" });
  }
});

module.exports = router;*/
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
});
