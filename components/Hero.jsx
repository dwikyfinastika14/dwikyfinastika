export default function Hero({ profile }) {
  const firstName = profile.name?.split(' ')[0] || 'a developer';
  const role = profile.role?.toLowerCase() || 'digital development';
  const heroTitle = profile.hero_title || `I'm ${firstName}, crafting my journey in ${role}.`;
  const heroIntro =
    profile.hero_intro ||
    'From early projects to professional milestones, explore the path that shaped me as a developer.';
  const primaryLabel = profile.primary_cta_label || 'Lihat perjalanan';
  const primaryHref = profile.primary_cta_href || '#about';
  const secondaryLabel = profile.secondary_cta_label || 'Download CV';
  const secondaryHref = profile.secondary_cta_href || '#contact';
  const initials = (profile.name || 'P')
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2);

  return (
    <section className="hero">
      <nav className="site-nav" aria-label="Navigasi utama">
        {/* <a className="site-brand" href="#top" aria-label="Home">
          <img src="/logo.png" alt="Logo" className="site-logo" />
        </a> */}
        <div className="site-nav-links">
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>
        <a className="nav-availability" href={`mailto:${profile.email || ''}`}>
          <span className="availability-dot" aria-hidden="true" /> {profile.availability_text || 'Tersedia untuk proyek'}
        </a>
      </nav>

      <div className="hero-content" id="top">
        <div className="hero-logo" aria-hidden="true">
          {initials}
        </div>
        <h1 className="hero-title">{heroTitle}</h1>
        <p className="hero-role">{profile.role}</p>
        <p className="hero-bio">{heroIntro}</p>
        <div className="hero-actions">
          <a href={primaryHref} className="btn-primary">
            {primaryLabel} <span aria-hidden="true">-&gt;</span>
          </a>
          <a href={secondaryHref} className="btn-ghost">
            {secondaryLabel} <span aria-hidden="true">v</span>
          </a>
        </div>
      </div>

      <a className="scroll-cue" href="#about" aria-label="Lanjut ke tentang saya">
        Scroll untuk menjelajah <span>v</span>
      </a>
    </section>
  );
}
