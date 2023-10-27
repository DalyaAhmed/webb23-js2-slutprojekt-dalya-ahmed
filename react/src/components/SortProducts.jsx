export default function SortProducts({ onSort }) {
  
  return (
    <div className="sort-container">
      <span>Sort products </span>
      <select onChange={(event) => onSort(event.target.value)}>
        <option value="asc">High to Low</option>
        <option value="desc">Low to High</option>
      </select>
    </div>
  );
}
