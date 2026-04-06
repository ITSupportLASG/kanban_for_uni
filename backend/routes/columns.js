/*const express = require("express");
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

module.exports = router;*/

const express = require("express");
const router = express.Router();
const db = require("../db");

// Get columns for a board with tasks inside
router.get("/by-board/:boardId", async (req, res) => {
  const boardId = Number(req.params.boardId);

  try {
    const columnsResult = await db.query(
      `
      SELECT *
      FROM columns
      WHERE board_id = $1
      ORDER BY position ASC, id ASC
      `,
      [boardId]
    );

    const tasksResult = await db.query(
      `
      SELECT
        t.*,
        u.name AS assigned_user_name
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.column_id IN (
        SELECT id FROM columns WHERE board_id = $1
      )
      ORDER BY t.position ASC, t.id ASC
      `,
      [boardId]
    );

    const result = columnsResult.rows.map((col) => ({
      ...col,
      tasks: tasksResult.rows.filter((t) => t.column_id === col.id),
    }));

    res.json(result);
  } catch (err) {
    console.error("Columns fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch columns" });
  }
});

// Create a new column
router.post("/", async (req, res) => {
  const { name, board_id, position } = req.body;

  try {
    const result = await db.query(
      `
      INSERT INTO columns (name, board_id, position)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [name, board_id, position ?? 0]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Create column error:", err.message);
    res.status(500).json({ error: "Failed to create column" });
  }
});

module.exports = router;
