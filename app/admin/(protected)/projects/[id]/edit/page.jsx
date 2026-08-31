import { getProject } from '@/lib/db';
import ProjectForm from '@/components/ProjectForm';
import { notFound } from 'next/navigation';

export default async function EditProjectPage({ params }) {
  const project = await getProject(params.id);
  if (!project) return notFound();

  return (
    <div>
      <h1>Edit Proyek</h1>
      <ProjectForm initial={project} projectId={params.id} />
    </div>
  );
}
