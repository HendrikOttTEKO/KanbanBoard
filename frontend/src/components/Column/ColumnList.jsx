import { useBoardContext } from "../../context/BoardContext";
import TaskCard from "../Task/TaskCard";

const COLUMN_TITLES = ["To Do", "In Progress", "Done"];

export default function ColumnList({ filterPriority }) {
  const { tasks } = useBoardContext();

  const visibleTasks = filterPriority
    ? tasks.filter((task) => task.priority === filterPriority)
    : tasks;

  return (
    <div className="board-columns">
      {COLUMN_TITLES.map((title) => (
        <div key={title} className="column">
          <h3>{title}</h3>
          {visibleTasks
            .filter((task) => task.status === title)
            .map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
        </div>
      ))}
    </div>
  );
}
