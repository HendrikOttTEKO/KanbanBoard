import { updateTask } from "../../api/taskService";
import { useBoardContext } from "../../context/BoardContext";

const PRIORITY_COLORS = {
  Hoch: "#e74c3c",
  Medium: "#f39c12",
  Niedrig: "#2ecc71",
};

export default function TaskCard({ task }) {
  const { tasks, setTasks } = useBoardContext();

  async function moveTask(newStatus) {
    try {
      const res = await updateTask(task._id, { status: newStatus });
      setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
    } catch (err) {
      console.error("Task konnte nicht verschoben werden", err);
    }
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
      </div>
    </div>
  );
}
