export default function FilterBar({ filterPriority, setFilterPriority }) {
  return (
    <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
      <option value="">Alle Prioritäten</option>
      <option value="Hoch">Hoch</option>
      <option value="Medium">Medium</option>
      <option value="Niedrig">Niedrig</option>
    </select>
  );
}