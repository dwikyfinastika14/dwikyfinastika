import db from '@/lib/db';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const profileRow = db.prepare('SELECT * FROM profile WHERE id = 1').get();
  const profile = { ...profileRow, skills: JSON.parse(profileRow.skills || '[]') };

  const projectRows = db.prepare('SELECT * FROM projects ORDER BY sort_order ASC, id ASC').all();
  const projects = projectRows.map((p) => ({ ...p, tags: JSON.parse(p.tags || '[]') }));
  const experienceRows = db.prepare('SELECT * FROM experiences ORDER BY sort_order ASC, id ASC').all();
  const experiences = experienceRows.map((experience) => ({
    ...experience,
    tags: JSON.parse(experience.tags || '[]'),
  }));

  return (
    <main>
      <Hero profile={profile} />
      <About profile={profile} />
      <Skills skills={profile.skills} />
      <Experience profile={profile} experiences={experiences} />
      <Projects projects={projects} />
      <Contact profile={profile} />
    </main>
  );
}
