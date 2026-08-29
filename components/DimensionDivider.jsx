export default function DimensionDivider({ label }) {
  return (
    <div className="dim-divider">
      <span className="dim-label">{label}</span>
      <span className="dim-line" aria-hidden="true" />
      <span className="dim-index" aria-hidden="true">+</span>
    </div>
  );
}
