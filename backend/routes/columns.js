const router = require("express").Router();
const pool = require("../db");

// Get columns for a board (with tasks inside)
router.get("/by-board/:boardId", async (req, res) => {
  const boardId = Number(req.params.boardId);

  try {
    const columnsRes = await pool.query(
      "SELECT * FROM columns WHERE board_id = $1 ORDER BY position ASC",
      [boardId]
    );

    const tasksRes = await pool.query(
      "SELECT * FROM tasks WHERE column_id IN (SELECT id FROM columns WHERE board_id = $1) ORDER BY position ASC",
      [boardId]
    );

    const columns = columnsRes.rows.map((col) => ({
      ...col,
      tasks: tasksRes.rows.filter((t) => t.column_id === col.id),
    }));

    res.json(columns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch columns" });
  }
});

module.exports = router;
