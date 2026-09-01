import { useParams } from "react-router-dom";
import { BoardProvider, useBoardContext } from "../context/BoardContext";
import ColumnList from "../components/Column/ColumnList";

function BoardContent() {
  const { board, loading, error } = useBoardContext();
  if (loading) return <p>Lade Board...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className="app">
      <h1>{board.title}</h1>
      <ColumnList />
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
