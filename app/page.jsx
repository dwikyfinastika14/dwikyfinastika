import { getProfile, listExperiences, listProjects } from '@/lib/db';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [profile, projects, experiences] = await Promise.all([
    getProfile(),
    listProjects(),
    listExperiences(),
  ]);

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
