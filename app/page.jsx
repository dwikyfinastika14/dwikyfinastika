import { getProfile, listExperiences, listProjects } from '@/lib/db';
import { unstable_noStore as noStore } from 'next/cache';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  noStore();

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
