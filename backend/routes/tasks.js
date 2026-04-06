const router = require("express").Router();
const pool = require("../db");
const db = require("../db");


// Create task
router.post("/", async (req, res) => {
  try {
    const { title, column_id, position, assigned_to } = req.body;

    // default Jira status = "To Do"
    const statusRes = await db.query(
      "SELECT id FROM statuses WHERE name = 'To Do' LIMIT 1"
    );
    const todoStatusId = statusRes.rows[0]?.id || 1;

    const result = await db.query(
      `INSERT INTO tasks (title, column_id, position, status_id, assigned_to)
   VALUES ($1, $2, $3, $4, $5)
   RETURNING *`,
      [title, column_id, position, todoStatusId, assigned_to || null]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// Move/update task (change column and/or position)
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { title, description, column_id, position } = req.body;

  try {
    const result = await pool.query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           column_id = COALESCE($3, column_id),
           position = COALESCE($4, position)
       WHERE id = $5
       RETURNING *`,
      [title || null, description || null, column_id || null, position || null, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete task
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.json({ deleted: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
