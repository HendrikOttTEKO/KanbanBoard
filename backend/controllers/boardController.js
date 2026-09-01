const Board = require("../models/Board");

exports.getBoards = async (req, res) => {
  try {
    const boards = await Board.find();
    res.json(boards);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Fehler beim Laden der Boards", error: err.message });
  }
};

exports.getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board)
      return res.status(404).json({ message: "Board nicht gefunden" });
    res.json(board);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Fehler beim Laden des Boards", error: err.message });
  }
};

exports.createBoard = async (req, res) => {
  try {
    const board = new Board(req.body);
    await board.save();
    res.status(201).json(board);
  } catch (err) {
    res.status(400).json({ message: "Ungültige Eingabe", error: err.message });
  }
};

exports.updateBoard = async (req, res) => {
  try {
    const board = await Board.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!board)
      return res.status(404).json({ message: "Board nicht gefunden" });
    res.json(board);
  } catch (err) {
    res.status(400).json({ message: "Ungültige Eingabe", error: err.message });
  }
};

exports.deleteBoard = async (req, res) => {
  try {
    const board = await Board.findByIdAndDelete(req.params.id);
    if (!board)
      return res.status(404).json({ message: "Board nicht gefunden" });
    res.json({ message: "Board wurde erfolgreich gelöscht" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Fehler beim Löschen", error: err.message });
  }
};
