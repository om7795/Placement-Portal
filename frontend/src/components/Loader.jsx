export default function Loader({ label = 'Loading\u2026' }) {
  return (
    <div className="spinner-wrap">
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 10px' }} />
        <span className="muted small">{label}</span>
      </div>
    </div>
  );
}
