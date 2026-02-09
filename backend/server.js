const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/boards", require("./routes/boards"));
app.use("/columns", require("./routes/columns"));
app.use("/tasks", require("./routes/tasks"));

// Health
app.get("/health", (req, res) => {
  res.json({ status: "Backend is running 🚀" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
const issueRoutes = require("./routes/issues");
app.use("/issues", issueRoutes);
