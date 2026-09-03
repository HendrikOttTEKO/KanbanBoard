const Task = require("../models/Task");

// READ: Alle Aufgaben abrufen
exports.getTasks = async (req, res) => {
  try {
    const filter = req.query.board ? { board: req.query.board } : {};
    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Fehler beim Laden der Tasks", error: err.message });
  }
};

// CREATE: Eine neue Aufgabe erstellen
exports.createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: "Ungültige Eingabe", error: err.message });
  }
};

// UPDATE: Eine bestehende Aufgabe bearbeiten
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!task) return res.status(404).json({ message: "Task nicht gefunden" });
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: "Ungültige Eingabe", error: err.message });
  }
};

// DELETE: Eine Aufgabe löschen
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task nicht gefunden" });
    res.json({ message: "Task wurde erfolgreich gelöscht" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Fehler beim Löschen", error: err.message });
  }
};
