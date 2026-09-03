import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBoards, deleteBoard, updateBoard } from "../api/boardService";
import BoardForm from "../components/Board/BoardForm";

export default function HomePage() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadBoards() {
      try {
        setLoading(true);
        const res = await getBoards();
        setBoards(res.data);
      } catch (err) {
        setError("Boards konnten nicht geladen werden.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadBoards();
  }, []);

  function handleBoardCreated(newBoard) {
    setBoards([...boards, newBoard]);
  }

  async function handleDelete(e, boardId, boardTitle) {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm(
      `Board "${boardTitle}" wirklich löschen? Alle zugehörigen Aufgaben werden ebenfalls gelöscht.`,
    );
    if (!confirmed) return;

    try {
      await deleteBoard(boardId);
      setBoards(boards.filter((b) => b._id !== boardId));
    } catch (err) {
      console.error("Board konnte nicht gelöscht werden", err);
    }
  }

  function startEditing(e, board) {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(board._id);
    setEditTitle(board.title);
    setEditDescription(board.description || "");
  }

  function cancelEditing(e) {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(null);
  }

  async function handleSave(e, boardId) {
    e.preventDefault();
    e.stopPropagation();

    if (editTitle.trim() === "") return;

    try {
      setSaving(true);
      const res = await updateBoard(boardId, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      });
      setBoards(boards.map((b) => (b._id === boardId ? res.data : b)));
      setEditingId(null);
    } catch (err) {
      console.error("Board konnte nicht gespeichert werden", err);
    } finally {
      setSaving(false);
    }
  }

  async function swapOrder(e, boardA, newOrderA, boardB, newOrderB) {
    e.preventDefault();
    e.stopPropagation();

    try {
      const [resA, resB] = await Promise.all([
        updateBoard(boardA._id, { order: newOrderA }),
        updateBoard(boardB._id, { order: newOrderB }),
      ]);
      setBoards(
        boards.map((b) => {
          if (b._id === boardA._id) return resA.data;
          if (b._id === boardB._id) return resB.data;
          return b;
        }),
      );
    } catch (err) {
      console.error("Reihenfolge konnte nicht geändert werden", err);
    }
  }

  const sortedBoards = [...boards].sort(
    (a, b) => (a.order || 0) - (b.order || 0) || a._id.localeCompare(b._id),
  );

  return (
    <div className="app">
      <h1>Meine Boards</h1>

      <BoardForm onBoardCreated={handleBoardCreated} />

      {loading && <p>Lade Boards...</p>}
      {error && <p style={{ color: "#e74c3c" }}>{error}</p>}

      {!loading && !error && boards.length === 0 && (
        <p>Noch keine Boards vorhanden. Erstelle dein erstes Board oben.</p>
      )}

      <div className="board-columns">
        {sortedBoards.map((board, index) =>
          editingId === board._id ? (
            <div key={board._id} className="board-card">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{
                  width: "100%",
                  marginBottom: "0.5rem",
                  padding: "0.4rem",
                }}
              />
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Beschreibung"
                style={{
                  width: "100%",
                  marginBottom: "0.5rem",
                  padding: "0.4rem",
                }}
              />
              <div>
                <button
                  onClick={(e) => handleSave(e, board._id)}
                  disabled={saving}
                >
                  {saving ? "Speichert..." : "Speichern"}
                </button>
                <button onClick={cancelEditing}>Abbrechen</button>
              </div>
            </div>
          ) : (
            <Link
              key={board._id}
              to={`/board/${board._id}`}
              className="board-card"
              style={{
                textDecoration: "none",
                color: "inherit",
                position: "relative",
              }}
            >
              <h3>{board.title}</h3>
              <p>{board.description}</p>
              <button
                onClick={(e) => startEditing(e, board)}
                style={{
                  marginTop: "0.5rem",
                  marginRight: "0.35rem",
                  background: "white",
                  border: "1px solid #dfe1e6",
                  borderRadius: "6px",
                  padding: "0.4rem 0.65rem",
                  cursor: "pointer",
                }}
              >
                Bearbeiten
              </button>
              <button
                onClick={(e) => handleDelete(e, board._id, board.title)}
                style={{
                  marginTop: "0.5rem",
                  marginRight: "0.35rem",
                  color: "#e74c3c",
                  background: "white",
                  border: "1px solid #dfe1e6",
                  borderRadius: "6px",
                  padding: "0.4rem 0.65rem",
                  cursor: "pointer",
                }}
              >
                Löschen
              </button>
              <button
                onClick={(e) => {
                  if (index > 0) {
                    const prev = sortedBoards[index - 1];
                    swapOrder(e, board, index - 1, prev, index);
                  } else {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                disabled={index === 0}
                style={{
                  marginTop: "0.5rem",
                  background: "white",
                  border: "1px solid #dfe1e6",
                  borderRadius: "6px",
                  padding: "0.4rem 0.65rem",
                  cursor: "pointer",
                }}
              >
                ↑
              </button>
              <button
                onClick={(e) => {
                  if (index < sortedBoards.length - 1) {
                    const next = sortedBoards[index + 1];
                    swapOrder(e, board, index + 1, next, index);
                  } else {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                disabled={index === sortedBoards.length - 1}
                style={{
                  marginTop: "0.5rem",
                  background: "white",
                  border: "1px solid #dfe1e6",
                  borderRadius: "6px",
                  padding: "0.4rem 0.65rem",
                  cursor: "pointer",
                }}
              >
                ↓
              </button>
            </Link>
          ),
        )}
      </div>
    </div>
  );
}
