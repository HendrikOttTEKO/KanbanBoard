import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BoardProvider, useBoardContext } from "../context/BoardContext";
import ColumnList from "../components/Column/ColumnList";
import FilterBar from "../components/Board/FilterBar";
import TaskForm from "../components/Task/TaskForm";

function BoardContent() {
  const { board, loading, error } = useBoardContext();
  const [filterPriority, setFilterPriority] = useState("");

  if (loading) return <p>Lade Board...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="app">
      <Link
        to="/"
        style={{
          display: "inline-block",
          marginBottom: "1rem",
          color: "#0c66e4",
        }}
      >
        ← Zurück zur Übersicht
      </Link>

      <h1>{board.title}</h1>
      <TaskForm />
      <FilterBar
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
      />
      <ColumnList filterPriority={filterPriority} />
    </div>
  );
}

export default function BoardPage() {
  const { boardId } = useParams();
  return (
    <BoardProvider boardId={boardId}>
      <BoardContent />
    </BoardProvider>
  );
}
