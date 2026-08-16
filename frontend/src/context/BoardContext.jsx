import { createContext, useContext, useState, useEffect } from 'react';
import { getBoardById } from '../api/boardService';
import { getTasksByBoard } from '../api/taskService';

const BoardContext = createContext();

export const useBoardContext = () => useContext(BoardContext);

export function BoardProvider({ boardId, children }) {
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadBoard() {
      try {
        setLoading(true);
        const [boardRes, tasksRes] = await Promise.all([
          getBoardById(boardId),
          getTasksByBoard(boardId)
        ]);
        setBoard(boardRes.data);
        setTasks(tasksRes.data);
      } catch (err) {
        setError('Board konnte nicht geladen werden.');
      } finally {
        setLoading(false);
      }
    }
    loadBoard();
  }, [boardId]);

  return (
    <BoardContext.Provider value={{ board, tasks, setTasks, loading, error }}>
      {children}
    </BoardContext.Provider>
  );
}