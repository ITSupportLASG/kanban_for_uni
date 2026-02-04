import { useEffect, useState } from "react";
import { api } from "./api";
import "./App.css";

function App() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");

  useEffect(() => {
    api.get("/boards").then((res) => {
      setBoards(res.data);
      if (res.data.length > 0) {
        setSelectedBoard(res.data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedBoard) {
      api.get(`/columns/by-board/${selectedBoard}`).then((res) => {
        setColumns(res.data);
      });
    }
  }, [selectedBoard]);

  const addTask = async () => {
    if (!taskTitle || !selectedColumn) return;

    await api.post("/tasks", {
      title: taskTitle,
      column_id: selectedColumn,
      position: 1,
    });

    const res = await api.get(`/columns/by-board/${selectedBoard}`);
    setColumns(res.data);
    setTaskTitle("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Kanban Board</h1>

      <select
        value={selectedBoard || ""}
        onChange={(e) => setSelectedBoard(e.target.value)}
      >
        {boards.map((b) => (
          <option key={b.id} value={b.id}>
            {b.title}
          </option>
        ))}
      </select>

      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        {columns.map((col) => (
          <div
            key={col.id}
            style={{
              border: "1px solid #ccc",
              padding: 10,
              width: 250,
            }}
          >
            <h3>{col.title}</h3>
            {col.tasks.map((task) => (
              <div key={task.id} style={{ padding: 5 }}>
                {task.title}
              </div>
            ))}
          </div>
        ))}
      </div>

      <h3>Add Task</h3>
      <input
        placeholder="Task title"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
      />

      <select
        value={selectedColumn}
        onChange={(e) => setSelectedColumn(e.target.value)}
      >
        <option value="">Select column</option>
        {columns.map((c) => (
          <option key={c.id} value={c.id}>
            {c.title}
          </option>
        ))}
      </select>

      <button onClick={addTask}>Add Task</button>
    </div>
  );
}

export default App;
