import DimensionDivider from './DimensionDivider';

export default function Skills({ skills }) {
  return (
    <section className="tech-strip" id="skills">
      <span className="tech-label">TECH STACK</span>
      <div className="skills-grid">
        {skills.map((skill, i) => (
          <div className="skill-chip" key={i}>
            <span>{skill}</span>
          </div>
        ))}
        {skills.length === 0 && (
          <p className="empty-state">Belum ada skill. Tambahkan lewat /admin/profile.</p>
        )}
      </div>
    </section>
  );
}
