export default function EmptyState({ icon = '\u{1F4ED}', title = 'Nothing here yet', hint }) {
  return (
    <div className="empty-state">
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      {hint && <p className="muted small">{hint}</p>}
    </div>
  );
}
