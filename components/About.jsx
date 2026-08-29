import DimensionDivider from './DimensionDivider';

export default function About({ profile }) {
  const aboutHeading = profile.about_heading || 'Core strengths and expertise';
  const aboutNote1 =
    profile.about_note_1 ||
    'Building thoughtful digital products with a focus on clarity, performance, and useful details.';
  const aboutNote2 =
    profile.about_note_2 ||
    'Combining strong technical foundations with a practical, human approach to every project.';
  const initials = (profile.name || 'P')
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2);

  return (
    <section className="section section-paper" id="about">
      <DimensionDivider label="About Me" />
      <div className="about-content">
        <div className="about-intro">
          <div className="about-avatar" aria-hidden="true">
            {initials}
          </div>
          <p className="about-text">{profile.bio}</p>
          {profile.email && (
            <a className="about-email" href={`mailto:${profile.email}`}>
              {profile.email} -&gt;
            </a>
          )}
        </div>
        <div className="about-strengths">
          <h2>{aboutHeading}</h2>
          <p>{aboutNote1}</p>
          <p>{aboutNote2}</p>
        </div>
      </div>
    </section>
  );
}
