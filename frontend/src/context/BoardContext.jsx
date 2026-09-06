import { createContext, useContext, useState, useEffect } from "react";

import { getBoardById } from "../api/boardService";
import { getTasksByBoard } from "../api/taskService";

const BoardContext = createContext();

export const useBoardContext = () => useContext(BoardContext);

const TEST_TASKS = [
  {
    _id: "1",
    title: "Projekt planen",
    description: "Aufgaben und Ziele festlegen",
    priority: "Hoch",
    status: "To Do",
  },
  {
    _id: "2",
    title: "Frontend gestalten",
    description: "Kanban Board UI erstellen",
    priority: "Medium",
    status: "In Progress",
  },
  {
    _id: "3",
    title: "Backend Setup",
    description: "Express und MongoDB einrichten",
    priority: "Niedrig",
    status: "Done",
  },
];

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
          getTasksByBoard(boardId),
        ]);

        setBoard(boardRes.data);

        const validStatuses = ["To Do", "In Progress", "Done"];

        const hasUsableTasks =
          Array.isArray(tasksRes.data) &&
          tasksRes.data.length > 0 &&
          tasksRes.data.every((task) => validStatuses.includes(task.status));

        if (hasUsableTasks) {
          setTasks(tasksRes.data);
        } else {
          console.log(
            "Backend-Daten passen noch nicht zum Frontend – Testdaten werden verwendet.",
          );

          setTasks(TEST_TASKS);
        }
      } catch (err) {
        console.log(
          "Backend noch nicht verfügbar – Testdaten werden verwendet.",
        );

        setBoard({
          _id: "test",
          title: "Mein Kanban Board",
        });

        setTasks(TEST_TASKS);
        setError(null);
      } finally {
        setLoading(false);
      }
    }

    loadBoard();
  }, [boardId]);

  console.log("TASKS IM CONTEXT:", tasks);

  return (
    <BoardContext.Provider value={{ board, tasks, setTasks, loading, error }}>
      {children}
    </BoardContext.Provider>
  );
}
