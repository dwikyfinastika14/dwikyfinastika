import DimensionDivider from './DimensionDivider';

export default function About({ profile }) {
  const aboutHeading = profile.about_heading || 'Core strengths and expertise';
  const initials = (profile.name || 'P')
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2);

  const socialLinks = [
    { name: 'github', icon: '𝙶', url: profile.github },
    { name: 'linkedin', icon: '𝙻', url: profile.linkedin },
    { name: 'instagram', icon: '𝙸', url: profile.instagram },
  ].filter(link => link.url);

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
              {profile.email} →
            </a>
          )}
          {socialLinks.length > 0 && (
            <div className="about-social">
              {socialLinks.map((link) => (
                <a key={link.name} href={link.url} title={link.name} target="_blank" rel="noopener noreferrer" className="about-social-link">
                  {link.icon}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="about-strengths">
          <h2>{aboutHeading}</h2>
          {profile.about_notes && profile.about_notes.length > 0 ? (
            profile.about_notes.map((note, index) => (
              <div key={index} className="about-strength-item">
                <p>{note}</p>
              </div>
            ))
          ) : (
            <>
              <div className="about-strength-item">
                <p>{profile.about_note_1}</p>
              </div>
              <div className="about-strength-item">
                <p>{profile.about_note_2}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
