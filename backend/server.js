const express = require("express");

const app = express();
const PORT = 3000;

// Erlaubt dem Server, JSON-Daten aus Anfragen zu lesen.
app.use(express.json());

// Vorläufige Aufgaben im Arbeitsspeicher.
// Später werden diese durch MongoDB ersetzt.
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

// Die nächste neu erstellte Aufgabe bekommt ID 3.
let nextTaskId = 3;

// Startseite des Backends.
app.get("/", (req, res) => {
  res.send("Kanban Board Backend läuft im Entwicklungsmodus!");
});

// READ: Alle Aufgaben abrufen.
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// CREATE: Eine neue Aufgabe erstellen.
app.post("/api/tasks", (req, res) => {
  const { title, status, priority } = req.body;

  // Titel muss vorhanden und ein Text sein.
  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      message: "Der Titel ist ein Pflichtfeld.",
    });
  }

  const newTask = {
    id: nextTaskId,
    title: title.trim(),
    status: status || "To Do",
    priority: priority || "Mittel",
  };

  tasks.push(newTask);

  // Für die nächste Aufgabe wird die ID um 1 erhöht.
  nextTaskId = nextTaskId + 1;

  res.status(201).json(newTask);
});

// UPDATE: Eine bestehende Aufgabe bearbeiten.
app.put("/api/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);

  const task = tasks.find((task) => task.id === taskId);

  if (!task) {
    return res.status(404).json({
      message: "Task wurde nicht gefunden.",
    });
  }

  const { title, status, priority } = req.body;

  // Titel nur ändern, wenn ein Titel gesendet wurde.
  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        message: "Der Titel darf nicht leer sein.",
      });
    }

    task.title = title.trim();
  }

  // Status nur ändern, wenn ein Status gesendet wurde.
  if (status !== undefined) {
    task.status = status;
  }

  // Priorität nur ändern, wenn eine Priorität gesendet wurde.
  if (priority !== undefined) {
    task.priority = priority;
  }

  res.json(task);
});

// DELETE: Eine Aufgabe löschen.
app.delete("/api/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);

  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({
      message: "Task wurde nicht gefunden.",
    });
  }

  tasks.splice(taskIndex, 1);

  res.json({
    message: "Task wurde erfolgreich gelöscht.",
  });
});

// Server starten.
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
