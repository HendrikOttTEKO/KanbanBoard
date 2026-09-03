const Column = require("../models/Column");

exports.getColumns = async (req, res) => {
  try {
    const filter = req.query.board ? { board: req.query.board } : {};
    const columns = await Column.find(filter);
    res.json(columns);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Fehler beim Laden der Columns", error: err.message });
  }
};

exports.createColumn = async (req, res) => {
  try {
    const column = new Column(req.body);
    await column.save();
    res.status(201).json(column);
  } catch (err) {
    res.status(400).json({ message: "Ungültige Eingabe", error: err.message });
  }
};

exports.updateColumn = async (req, res) => {
  try {
    const column = await Column.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!column)
      return res.status(404).json({ message: "Column nicht gefunden" });
    res.json(column);
  } catch (err) {
    res.status(400).json({ message: "Ungültige Eingabe", error: err.message });
  }
};

exports.deleteColumn = async (req, res) => {
  try {
    const column = await Column.findByIdAndDelete(req.params.id);
    if (!column)
      return res.status(404).json({ message: "Column nicht gefunden" });
    res.json({ message: "Column wurde erfolgreich gelöscht" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Fehler beim Löschen", error: err.message });
  }
};
