import { useState } from "react";
import { useParams } from "react-router-dom";
import { BoardProvider, useBoardContext } from "../context/BoardContext";
import ColumnList from "../components/Column/ColumnList";
import FilterBar from "../components/Board/FilterBar";

function BoardContent() {
  const { board, loading, error } = useBoardContext();
  const [filterPriority, setFilterPriority] = useState("");

  if (loading) return <p>Lade Board...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="app">
      <h1>{board.title}</h1>
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
