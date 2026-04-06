/*const express =require("express");
const router = express.Router();
const pool = require("../db");

// Get columns for a board (with tasks inside)
router.get("/by-board/:boardId", async (req, res) => {
  const boardId = Number(req.params.boardId);

  try {
    const columnsRes = await pool.query(
      "SELECT * FROM columns WHERE board_id = $1 ORDER BY position ASC",
      [boardId]
    );*/

    /*const tasksRes = await pool.query(
      "SELECT * FROM tasks WHERE column_id IN (SELECT id FROM columns WHERE board_id = $1) ORDER BY position ASC",
      [boardId]
    );*/
    /*const tasksRes = await pool.query(
      `SELECT 
      t.*,
      u.name AS assigned_user_name
   FROM tasks t
   LEFT JOIN users u ON t.assigned_to = u.id
   WHERE t.column_id IN (
     SELECT id FROM columns WHERE board_id = $1
   )
   ORDER BY t.position ASC`,
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

module.exports = router;*/
const express = require("express");
const router = express.Router();
const db = require("../db");

// Get columns for a board with tasks inside
router.get("/by-board/:boardId", (req, res) => {
  const boardId = Number(req.params.boardId);

  const columnsQuery = `
    SELECT * FROM columns
    WHERE board_id = ?
    ORDER BY id ASC
  `;

  const tasksQuery = `
    SELECT 
      t.*,
      u.name AS assigned_user_name
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    WHERE t.column_id IN (
      SELECT id FROM columns WHERE board_id = ?
    )
    ORDER BY t.id ASC
  `;

  db.all(columnsQuery, [boardId], (err, columns) => {
    if (err) {
      console.error("Columns fetch error:", err.message);
      return res.status(500).json({ error: "Failed to fetch columns" });
    }

    db.all(tasksQuery, [boardId], (err, tasks) => {
      if (err) {
        console.error("Tasks fetch error:", err.message);
        return res.status(500).json({ error: "Failed to fetch tasks" });
      }

      const result = columns.map((col) => ({
        ...col,
        tasks: tasks.filter((t) => t.column_id === col.id),
      }));

      res.json(result);
    });
  });
});

module.exports = router;
