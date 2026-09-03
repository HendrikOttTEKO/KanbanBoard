import { updateTask } from "../../api/taskService";
import { useBoardContext } from "../../context/BoardContext";
import TaskCard from "../Task/TaskCard";

const COLUMN_TITLES = ["To Do", "In Progress", "Done"];

export default function ColumnList({ filterPriority }) {
  const { tasks, setTasks } = useBoardContext();

  async function swapOrder(taskA, newOrderA, taskB, newOrderB) {
    try {
      const [resA, resB] = await Promise.all([
        updateTask(taskA._id, { order: newOrderA }),
        updateTask(taskB._id, { order: newOrderB }),
      ]);
      setTasks(
        tasks.map((t) => {
          if (t._id === taskA._id) return resA.data;
          if (t._id === taskB._id) return resB.data;
          return t;
        }),
      );
    } catch (err) {
      console.error("Reihenfolge konnte nicht geändert werden", err);
    }
  }

  return (
    <div className="board-columns">
      {COLUMN_TITLES.map((title) => {
        const columnTasks = tasks
          .filter((task) => task.status === title)
          .filter((task) => !filterPriority || task.priority === filterPriority)
          .sort((a, b) => a.order - b.order || a._id.localeCompare(b._id));

        return (
          <div key={title} className="column">
            <h3>{title}</h3>

            {columnTasks.map((task, index) => (
              <TaskCard
                key={task._id}
                task={task}
                isFirst={index === 0}
                isLast={index === columnTasks.length - 1}
                onMoveUp={() => {
                  if (index > 0) {
                    const prev = columnTasks[index - 1];
                    swapOrder(task, index - 1, prev, index);
                  }
                }}
                onMoveDown={() => {
                  if (index < columnTasks.length - 1) {
                    const next = columnTasks[index + 1];
                    swapOrder(task, index + 1, next, index);
                  }
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
