import DimensionDivider from './DimensionDivider';

export default function Experience({ profile, experiences = [] }) {
  const experienceSummary =
    profile.experience_summary ||
    `Over the past ${profile.years_experience || 1}+ years, I have worked across different projects and digital products.`;
  const entries =
    experiences.length > 0
      ? experiences
      : [
          {
            company: 'Independent Developer',
            period: `${profile.years_experience || 1}+ years - Present`,
            title: profile.role || 'Fullstack Developer',
            location: profile.location,
            tags: profile.skills.slice(0, 4),
          },
        ];

  return (
    <section className="experience-section" id="experience">
      <DimensionDivider label="Experience" />
      <div className="experience-heading">
        <p>{experienceSummary}</p>
      </div>
      <div className="experience-list">
        {entries.map((entry, index) => (
          <article
            className={`experience-item${index === 0 ? ' experience-item-current' : ''}`}
            key={`${entry.company}-${index}`}
          >
            <div className="experience-company">
              <span className="experience-mark" aria-hidden="true">
                {entry.company.slice(0, 1)}
              </span>
              <div>
                <strong>{entry.company}</strong>
                <span>{entry.period}</span>
              </div>
            </div>
            <strong className="experience-title">{entry.title}</strong>
            <div className="experience-meta">
              <span>{entry.location}</span>
              <div className="experience-tags">
                {(entry.tags || []).map((tag, tagIndex) => (
                  <span key={`${tag}-${tagIndex}`}>{tag}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
