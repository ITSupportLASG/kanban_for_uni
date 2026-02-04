const router = require("express").Router();
const pool = require("../db");

// Create task
router.post("/", async (req, res) => {
  const { title, description, column_id, position } = req.body;

  if (!title || !column_id || !position) {
    return res
      .status(400)
      .json({ error: "title, column_id, position are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO tasks (title, description, column_id, position) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, description || null, column_id, position]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task" });
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
