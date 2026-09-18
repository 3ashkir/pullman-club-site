import ItemRow from './ItemRow.jsx'

export default function ItemList({ items }) {
  return (
    <div className="table">
      <div className="table-head" aria-hidden="true">
        <span>Item</span>
        <span>PAR location</span>
        <span>Status</span>
        <span>Last updated</span>
        <span>Expected next update</span>
      </div>
      <ul className="rows">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </ul>
    </div>
  )
}
