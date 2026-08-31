import DimensionDivider from './DimensionDivider';

export default function About({ profile }) {
  const aboutHeading = profile.about_heading || 'Core strengths and expertise';
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
            {profile.image_url ? (
              <img src={profile.image_url} alt={profile.name || 'Profile'} className="about-avatar-image" />
            ) : (
              initials
            )}
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
          {profile.about_notes && profile.about_notes.length > 0 ? (
            profile.about_notes.map((note, index) => (
              <p key={index}>{note}</p>
            ))
          ) : (
            <>
              <p>{profile.about_note_1}</p>
              <p>{profile.about_note_2}</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
