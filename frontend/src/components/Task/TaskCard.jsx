import { useState } from "react";
import { updateTask, deleteTask } from "../../api/taskService";
import { useBoardContext } from "../../context/BoardContext";

const PRIORITY_COLORS = {
  Hoch: "#e74c3c",
  Medium: "#f39c12",
  Niedrig: "#2ecc71",
};

export default function TaskCard({
  task,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) {
  const { tasks, setTasks } = useBoardContext();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(
    task.description || "",
  );
  const [editPriority, setEditPriority] = useState(task.priority);
  const [saving, setSaving] = useState(false);

  async function moveTask(newStatus) {
    try {
      const res = await updateTask(task._id, { status: newStatus });
      setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
    } catch (err) {
      console.error("Task konnte nicht verschoben werden", err);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(`"${task.title}" wirklich löschen?`);
    if (!confirmed) return;

    try {
      await deleteTask(task._id);
      setTasks(tasks.filter((t) => t._id !== task._id));
    } catch (err) {
      console.error("Task konnte nicht gelöscht werden", err);
    }
  }

  async function handleSave() {
    if (editTitle.trim() === "") return;

    try {
      setSaving(true);
      const res = await updateTask(task._id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        priority: editPriority,
      });
      setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
      setIsEditing(false);
    } catch (err) {
      console.error("Task konnte nicht gespeichert werden", err);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditPriority(task.priority);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div
        className="task-card"
        style={{ border: `2px solid ${PRIORITY_COLORS[task.priority]}` }}
      >
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.4rem" }}
        />
        <input
          type="text"
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          placeholder="Beschreibung"
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.4rem" }}
        />
        <select
          value={editPriority}
          onChange={(e) => setEditPriority(e.target.value)}
          style={{ marginBottom: "0.5rem" }}
        >
          <option value="Hoch">Hoch</option>
          <option value="Medium">Medium</option>
          <option value="Niedrig">Niedrig</option>
        </select>
        <div>
          <button onClick={handleSave} disabled={saving}>
            {saving ? "Speichert..." : "Speichern"}
          </button>
          <button onClick={handleCancel}>Abbrechen</button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="task-card"
      style={{
        border: `2px solid ${PRIORITY_COLORS[task.priority]}`,
      }}
    >
      <strong>{task.title}</strong>
      <p>{task.description}</p>
      <small>Priorität: {task.priority}</small>
      <div>
        <button onClick={() => moveTask("To Do")}>To Do</button>
        <button onClick={() => moveTask("In Progress")}>In Progress</button>
        <button onClick={() => moveTask("Done")}>Done</button>
        <button onClick={() => setIsEditing(true)}>Bearbeiten</button>
        <button onClick={handleDelete} style={{ color: "#e74c3c" }}>
          Löschen
        </button>
        <button onClick={onMoveUp} disabled={isFirst} title="Nach oben">
          ↑
        </button>
        <button onClick={onMoveDown} disabled={isLast} title="Nach unten">
          ↓
        </button>
      </div>
    </div>
  );
}
