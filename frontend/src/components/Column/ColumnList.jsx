import { useBoardContext } from '../../context/BoardContext';
import TaskCard from '../Task/TaskCard';

const COLUMN_TITLES = ['To Do', 'In Progress', 'Done']; // placeholder

export default function ColumnList() {
  const { tasks } = useBoardContext();

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {COLUMN_TITLES.map((title) => (
        <div key={title} style={{ flex: 1, border: '1px solid #ccc', padding: '0.5rem' }}>
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