import { useState } from "react";
import { useBoardContext } from "../../context/BoardContext";

export default function TaskForm() {
  const { tasks, setTasks } = useBoardContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");

  function handleSubmit(e) {
    e.preventDefault();

    if (title.trim() === "") {
      return;
    }

    const newTask = {
      _id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      priority,
      status: "To Do",
    };

    setTasks([...tasks, newTask]);

    setTitle("");
    setDescription("");
    setPriority("Medium");
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

      <button type="submit">+ Neue Aufgabe</button>
    </form>
  );
}
