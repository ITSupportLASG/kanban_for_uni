import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function IssueModal({ issueId, onClose, onSaved }) {
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("details");

  const [newComment, setNewComment] = useState("");
  const [author, setAuthor] = useState("Student");

  const [toStatusId, setToStatusId] = useState("");

  async function safeJson(res) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  async function loadAll() {
    if (!API) {
      alert("VITE_API_URL is not set. Add it in frontend/.env and restart frontend.");
      return;
    }

    // Issue details
    const issueRes = await fetch(`${API}/issues/${issueId}`);
    const issueData = await safeJson(issueRes);

    if (!issueRes.ok) {
      alert(issueData?.error || "Failed to load issue");
      return;
    }
    setIssue(issueData);

    // Comments
    const cRes = await fetch(`${API}/issues/${issueId}/comments`);
    const cData = await safeJson(cRes);
    setComments(Array.isArray(cData) ? cData : []);

    // History
    const hRes = await fetch(`${API}/issues/${issueId}/history`);
    const hData = await safeJson(hRes);
    setHistory(Array.isArray(hData) ? hData : []);
  }

  useEffect(() => {
    if (!issueId) return;
    setIssue(null);
    setComments([]);
    setHistory([]);
    setActiveTab("details");
    setToStatusId("");
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issueId]);

  async function addComment() {
    if (!newComment.trim()) return;

    const res = await fetch(`${API}/issues/${issueId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author, message: newComment }),
    });

    const data = await safeJson(res);
    if (!res.ok) {
      alert(data?.error || "Failed to add comment");
      return;
    }

    setNewComment("");
    await loadAll();
  }

  async function moveIssue() {
    if (!toStatusId) return;

    const res = await fetch(`${API}/issues/${issueId}/move`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toStatusId: Number(toStatusId) }),
    });

    const data = await safeJson(res);

    if (!res.ok) {
      alert(data?.error || "Move failed (transition not allowed)");
      return;
    }

    await loadAll();
    onSaved?.();
  }

  if (!issueId) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {!issue ? (
          <div style={{ color: "#fff" }}>Loading...</div>
        ) : (
          <>
            <div className="modal-header">
              <div>
                <h2 style={{ margin: 0 }}>
                  {issue.issue_key || `TASK-${issue.id}`}
                </h2>
                <div style={{ opacity: 0.85 }}>{issue.title}</div>
              </div>
              <button onClick={onClose}>✕</button>
            </div>

            <div className="modal-meta">
              <div>
                <b>Status:</b> {issue.status_name || issue.status_id}
              </div>
              <div>
                <b>Priority:</b> {issue.priority || "MEDIUM"}
              </div>
              <div>
                <b>Assignee:</b> {issue.assigned_user_name || "-"}
              </div>
              <div>
                <b>Reporter:</b> {issue.reporter || "-"}
              </div>
              <div>
                <b>Due:</b> {issue.due_date || "-"}
              </div>
            </div>

            <div className="tabs">
              <button
                className={activeTab === "details" ? "active" : ""}
                onClick={() => setActiveTab("details")}
              >
                Details
              </button>
              <button
                className={activeTab === "comments" ? "active" : ""}
                onClick={() => setActiveTab("comments")}
              >
                Comments
              </button>
              <button
                className={activeTab === "history" ? "active" : ""}
                onClick={() => setActiveTab("history")}
              >
                History
              </button>
            </div>

            {activeTab === "details" && (
              <div className="tab-content">
                <h3>Description</h3>
                <p style={{ whiteSpace: "pre-wrap" }}>
                  {issue.description || "No description"}
                </p>

                <div style={{ marginTop: 16 }}>
                  <h3>Move issue (Jira workflow)</h3>

                  <div style={{ display: "flex", gap: 8 }}>
                    <select
                      value={toStatusId}
                      onChange={(e) => setToStatusId(e.target.value)}
                    >
                      <option value="">Select new status...</option>
                      <option value="1">To Do</option>
                      <option value="2">In Progress</option>
                      <option value="3">Review</option>
                      <option value="4">Done</option>
                    </select>

                    <button onClick={moveIssue}>Move</button>
                  </div>

                  <div style={{ marginTop: 8, opacity: 0.8 }}>
                    Backend validates allowed transitions (Jira style).
                  </div>
                </div>
              </div>
            )}

            {activeTab === "comments" && (
              <div className="tab-content">
                <h3>Comments</h3>

                <div className="comment-list">
                  {comments.map((c) => (
                    <div className="comment" key={c.id}>
                      <div className="comment-top">
                        <b>{c.author || "Unknown"}</b>
                        <span style={{ opacity: 0.7, marginLeft: 8 }}>
                          {c.created_at
                            ? new Date(c.created_at).toLocaleString()
                            : ""}
                        </span>
                      </div>
                      <div style={{ whiteSpace: "pre-wrap" }}>{c.message}</div>
                    </div>
                  ))}

                  {comments.length === 0 && (
                    <div style={{ opacity: 0.85 }}>No comments yet.</div>
                  )}
                </div>

                <div className="comment-box">
                  <input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Your name"
                  />

                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows={3}
                  />

                  <button onClick={addComment}>Add Comment</button>
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div className="tab-content">
                <h3>History (Audit log)</h3>

                {history.map((h) => (
                  <div className="history" key={h.id}>
                    <div>
                      <b>{h.field}</b>: {h.old_value ?? "-"} →{" "}
                      {h.new_value ?? "-"}
                    </div>
                    <div style={{ opacity: 0.7 }}>
                      {h.changed_at
                        ? new Date(h.changed_at).toLocaleString()
                        : ""}
                    </div>
                  </div>
                ))}

                {history.length === 0 && (
                  <div style={{ opacity: 0.85 }}>No changes yet.</div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
