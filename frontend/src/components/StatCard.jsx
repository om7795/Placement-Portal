export default function StatCard({ value, label, hint }) {
  return (
    <div className="stat-card">
      <div className="value">{value}</div>
      <div className="label">{label}</div>
      {hint && <div className="muted small mt-1">{hint}</div>}
    </div>
  );
}
