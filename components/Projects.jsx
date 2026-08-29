import DimensionDivider from './DimensionDivider';

export default function Projects({ projects }) {
  return (
    <section className="section section-paper" id="projects">
      <DimensionDivider label="Key Projects" />
      <div className="projects-grid">
        {projects.map((project) => {
          const href = project.link || project.repo;
          return (
            <a
              key={project.id}
              href={href || '#'}
              target={href ? '_blank' : undefined}
              rel={href ? 'noreferrer' : undefined}
              className="project-card"
              style={!href ? { pointerEvents: 'none' } : undefined}
            >
              <div className="project-image">
                {project.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={project.image} alt={project.title} />
                ) : (
                  <div className="project-image-placeholder">BELUM ADA GAMBAR</div>
                )}
                {project.year && <span className="project-year">{project.year}</span>}
              </div>
              <div className="project-body">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                {project.tags.length > 0 && (
                  <div className="project-tags">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </a>
          );
        })}
        {projects.length === 0 && (
          <p className="empty-state">Belum ada proyek. Tambahkan lewat halaman admin di /admin.</p>
        )}
      </div>
    </section>
  );
}
