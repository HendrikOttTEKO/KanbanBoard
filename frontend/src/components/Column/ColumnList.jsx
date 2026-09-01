import { useBoardContext } from "../../context/BoardContext";
import TaskCard from "../Task/TaskCard";

const COLUMN_TITLES = ["To Do", "In Progress", "Done"];

export default function ColumnList() {
  const { tasks } = useBoardContext();

  return (
    <div className="board-columns">
      {COLUMN_TITLES.map((title) => (
        <div key={title} className="column">
          <h3>{title}</h3>

          {tasks
            .filter((task) => task.status === title)
            .map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
        </div>
      ))}
    </div>
  );
}
