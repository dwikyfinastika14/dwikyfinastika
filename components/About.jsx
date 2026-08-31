import DimensionDivider from './DimensionDivider';

function SocialIcon({ type }) {
  const iconProps = {
    className: 'about-social-icon',
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': 'true',
  };

  if (type === 'Email') {
    return (
      <svg {...iconProps}>
        <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === 'GitHub') {
    return (
      <svg {...iconProps} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.9c-2.78.62-3.37-1.21-3.37-1.21-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.64-1.37-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.36 9.36 0 0 1 12 6.98c.85 0 1.7.12 2.5.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9v2.8c0 .27.18.59.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
      </svg>
    );
  }

  if (type === 'LinkedIn') {
    return (
      <svg {...iconProps} fill="currentColor" viewBox="0 0 24 24">
        <path d="M6.94 8.88H3.75v10.37h3.19V8.88ZM5.34 4.75a1.85 1.85 0 1 0 0 3.7 1.85 1.85 0 0 0 0-3.7Zm13.91 8.53c0-2.78-1.48-4.08-3.46-4.08a2.98 2.98 0 0 0-2.7 1.49h-.04V8.88H10v10.37h3.18v-5.13c0-1.35.26-2.66 1.93-2.66 1.65 0 1.67 1.54 1.67 2.75v5.04h3.17l-.7-5.97Z" />
      </svg>
    );
  }

  if (type === 'Instagram') {
    return (
      <svg {...iconProps}>
        <rect x="4" y="4" width="16" height="16" rx="4.2" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="16.8" cy="7.2" r="1" fill="currentColor" />
      </svg>
    );
  }

  return null;
}

export default function About({ profile }) {
  const aboutHeading = profile.about_heading || 'Core strengths and expertise';
  const initials = (profile.name || 'P')
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2);

  const socialLinks = [
    { name: 'Email', value: profile.email },
    { name: 'GitHub', value: profile.github },
    { name: 'LinkedIn', value: profile.linkedin },
    { name: 'Instagram', value: profile.instagram },
  ].filter(link => link.value);

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
                <a 
                  key={link.name} 
                  href={getContactHref(link.name, link.value)}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="about-social-link"
                  aria-label={link.name}
                  title={link.name}
                >
                  <SocialIcon type={link.name} />
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

function getContactHref(label, value) {
  if (!value) {
    return null;
  }

  const cleanValue = value.trim();

  if (label === 'Email') {
    return `mailto:${cleanValue}`;
  }

  if (/^(https?:\/\/|mailto:|tel:|#)/i.test(cleanValue)) {
    return cleanValue;
  }

  if (/^(www\.|[\w-]+\.)/i.test(cleanValue)) {
    return `https://${cleanValue}`;
  }

  const username = cleanValue.replace(/^@/, '');
  const baseUrls = {
    GitHub: 'https://github.com/',
    LinkedIn: 'https://linkedin.com/in/',
    Instagram: 'https://instagram.com/',
  };

  return `${baseUrls[label]}${username}`;
}
