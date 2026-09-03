import { useState } from "react";
import { createBoard } from "../../api/boardService";

export default function BoardForm({ onBoardCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    if (title.trim() === "") {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await createBoard({
        title: title.trim(),
        description: description.trim(),
      });

      onBoardCreated(res.data);

      setTitle("");
      setDescription("");
    } catch (err) {
      setError("Board konnte nicht erstellt werden.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Board-Titel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="Beschreibung (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button type="submit" disabled={submitting}>
        {submitting ? "Speichert..." : "+ Neues Board"}
      </button>

      {error && (
        <p style={{ color: "#e74c3c", marginLeft: "0.5rem" }}>{error}</p>
      )}
    </form>
  );
}
