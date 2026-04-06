const express = require("express");
const router = express.Router();
const db = require("../db");

/**
 * Get full issue details (Jira issue view)
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const issue = await db.query(
      `SELECT 
  t.*, 
  s.name AS status_name,
  u.name AS assigned_user_name
FROM tasks t
LEFT JOIN statuses s ON s.id = t.status_id
LEFT JOIN users u ON t.assigned_to = u.id
WHERE t.id = $1`,
      [id]
    );

    if (issue.rows.length === 0) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.json(issue.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


/**
 * Move issue (Jira workflow validation)
 */
router.patch("/:id/move", async (req, res) => {
  const { id } = req.params;
  const { toStatusId } = req.body;

  try {
    const current = await db.query(
      "SELECT status_id, column_id FROM tasks WHERE id = $1",
      [id]
    );

    if (current.rows.length === 0) {
      return res.status(404).json({ error: "Issue not found" });
    }

    const fromStatusId = current.rows[0].status_id;

    // ✅ Validate Jira transition
    const allowed = await db.query(
      `SELECT 1 FROM status_transitions
       WHERE from_status_id = $1 AND to_status_id = $2`,
      [fromStatusId, toStatusId]
    );

    if (allowed.rowCount === 0) {
      return res.status(400).json({ error: "Invalid Jira transition" });
    }

    // ✅ Decide which column to move the card to (so board matches Jira status)
    const targetStatus = await db.query(
      "SELECT name FROM statuses WHERE id = $1",
      [toStatusId]
    );

    const statusName = targetStatus.rows[0]?.name;

    let columnTitle = null;
    if (statusName === "To Do") columnTitle = "To Do";
    else if (statusName === "In Progress") columnTitle = "In Progress";
    else if (statusName === "Review") columnTitle = "Review"; // until you add a Review column
    else if (statusName === "Done") columnTitle = "Done";

    let newColumnId = current.rows[0].column_id;

    if (columnTitle) {
      const colRes = await db.query(
        "SELECT id FROM columns WHERE title = $1 LIMIT 1",
        [columnTitle]
      );
      if (colRes.rows.length > 0) {
        newColumnId = colRes.rows[0].id;
      }
    }

    // ✅ Update both status_id and column_id
    await db.query(
      "UPDATE tasks SET status_id = $1, column_id = $2 WHERE id = $3",
      [toStatusId, newColumnId, id]
    );

    // ✅ History log (store names so it looks nicer in UI later)
    await db.query(
      `INSERT INTO issue_history (issue_id, field, old_value, new_value)
       VALUES ($1, 'status', $2, $3)`,
      [id, String(fromStatusId), String(toStatusId)]
    );

    res.json({ success: true, toStatusId, newColumnId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


/**
 * Issue comments (Jira discussion)
 */
router.get("/:id/comments", async (req, res) => {
  const { id } = req.params;

  const comments = await db.query(
    "SELECT * FROM issue_comments WHERE issue_id = $1 ORDER BY created_at",
    [id]
  );

  res.json(comments.rows);
});

router.post("/:id/comments", async (req, res) => {
  const { id } = req.params;
  const { author, message } = req.body;

  await db.query(
    `INSERT INTO issue_comments (issue_id, author, message)
     VALUES ($1, $2, $3)`,
    [id, author, message]
  );

  res.json({ success: true });
});

/**
 * Issue history (audit log)
 */
router.get("/:id/history", async (req, res) => {
  const { id } = req.params;

  const history = await db.query(
    "SELECT * FROM issue_history WHERE issue_id = $1 ORDER BY changed_at",
    [id]
  );

  res.json(history.rows);
});

module.exports = router;
