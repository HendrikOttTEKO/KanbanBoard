const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

const tasks = [
  {
    id: 1,
    title: "Backend einrichten",
    status: "To Do",
    priority: "Hoch",
  },
  {
    id: 2,
    title: "Kanban Board gestalten",
    status: "In Progress",
    priority: "Mittel",
  },
];

app.get("/", (req, res) => {
  res.send("Kanban Board Backend läuft im Entwicklingsmodus!");
});

app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const newTask = {
    id: tasks.length + 1,
    title: req.body.title,
    status: req.body.status,
    priority: req.body.priority,
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
