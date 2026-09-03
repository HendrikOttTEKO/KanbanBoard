import { useState } from "react";
import { createTask } from "../../api/taskService";
import { useBoardContext } from "../../context/BoardContext";

export default function TaskForm() {
  const { board, tasks, setTasks } = useBoardContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
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

      const res = await createTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        board: board._id,
      });

      setTasks([...tasks, res.data]);

      setTitle("");
      setDescription("");
      setPriority("Medium");
    } catch (err) {
      setError("Aufgabe konnte nicht erstellt werden.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Titel der Aufgabe"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="Beschreibung"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="Hoch">Hoch</option>
        <option value="Medium">Medium</option>
        <option value="Niedrig">Niedrig</option>
      </select>

      <button type="submit" disabled={submitting}>
        {submitting ? "Speichert..." : "+ Neue Aufgabe"}
      </button>

      {error && (
        <p style={{ color: "#e74c3c", marginLeft: "0.5rem" }}>{error}</p>
      )}
    </form>
  );
}
