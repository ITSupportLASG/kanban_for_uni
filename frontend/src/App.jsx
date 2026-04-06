import { useEffect, useState } from "react";
import { api } from "./api";
import IssueModal from "./components/IssueModal";
import "./App.css";

function App() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [columns, setColumns] = useState([]);

  const [taskTitle, setTaskTitle] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [users, setUsers] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");

  // ✅ Jira-like modal state
  const [selectedIssueId, setSelectedIssueId] = useState(null);

  /*const loadUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data);
  };*/
  const loadUsers = async () => {
    try {
      const res = await api.get("/api/users");
      console.log("USERS:", res.data);
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  const loadBoards = async () => {
    const res = await api.get("/boards");
    setBoards(res.data);
    if (res.data.length > 0 && !selectedBoard) {
      setSelectedBoard(res.data[0].id);
    }
  };

  const loadColumns = async (boardId) => {
    if (!boardId) return;
    const res = await api.get(`/columns/by-board/${boardId}`);
    setColumns(res.data);
  };

  useEffect(() => {
    loadBoards();
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedBoard) {
      loadColumns(selectedBoard);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBoard]);

  const addTask = async () => {
    if (!taskTitle.trim()) {
      alert("Please enter a task title");
      return;
    }
    if (!selectedColumn) {
      alert("Please select a column");
      return;
    }

    await api.post("/tasks", {
      title: taskTitle.trim(),
      column_id: Number(selectedColumn),
      position: 1,
      assigned_to: assignedTo ? Number(assignedTo) : null,
    });

    await loadColumns(selectedBoard);
    setTaskTitle("");
    setSelectedColumn(""); // ✅ reset so you remember to select again
  };

  return (
    <div className="appWrap">
      <h1>Stepan's Kanban Board</h1>

      <select
        className="select"
        value={selectedBoard || ""}
        onChange={(e) => setSelectedBoard(e.target.value)}
      >
        {boards.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>

      {/* ✅ Jira-style board */}
      <div className="board">
        {columns.map((col) => (
          <div className="column" key={col.id}>
            <div className="columnHeader">
              <h3>{col.name}</h3>
              <span className="count">{col.tasks.length}</span>
            </div>

            <div className="taskList">
              {col.tasks.map((task) => (
                <div
                  key={task.id}
                  className="taskCard"
                  onClick={() => setSelectedIssueId(task.id)}
                  title="Click to open Jira-style issue details"
                >
                  <div className="taskKey">
                    {task.issue_key || `TASK-${task.id}`}
                  </div>
                  <div className="taskTitle">{task.title}</div>
                  <div className="taskMeta">
                    Assigned to: {task.assigned_user_name || "Unassigned"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Jira-style add task */}
      <div className="addTask">
        <h3>Add Task</h3>

        <div className="addRow">
          <input
            className="input"
            placeholder="Task title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />

          <select
            className="select"
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
          >
            <option value="">Select column</option>
            {columns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            className="select"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          <button className="btn" onClick={addTask}>
            Add
          </button>
        </div>
      </div>

      {/* ✅ Jira-like Issue Modal */}
      <IssueModal
        issueId={selectedIssueId}
        columns={columns}
        onClose={() => setSelectedIssueId(null)}
        onSaved={() => loadColumns(selectedBoard)}// refresh board after move/comment
      />
    </div>
  );
}

export default App;
