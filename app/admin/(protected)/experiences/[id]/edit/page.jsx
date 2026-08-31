import { getExperience } from '@/lib/db';
import ExperienceForm from '@/components/ExperienceForm';
import { notFound } from 'next/navigation';

export default async function EditExperiencePage({ params }) {
  const experience = await getExperience(params.id);
  if (!experience) return notFound();

  return (
    <div>
      <h1>Edit Experience</h1>
      <ExperienceForm initial={experience} experienceId={params.id} />
    </div>
  );
}
