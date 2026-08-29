import db from '@/lib/db';
import ExperienceForm from '@/components/ExperienceForm';
import { notFound } from 'next/navigation';

export default function EditExperiencePage({ params }) {
  const experience = db.prepare('SELECT * FROM experiences WHERE id = ?').get(params.id);
  if (!experience) return notFound();
  const parsed = { ...experience, tags: JSON.parse(experience.tags || '[]') };

  return (
    <div>
      <h1>Edit Experience</h1>
      <ExperienceForm initial={parsed} experienceId={params.id} />
    </div>
  );
}
