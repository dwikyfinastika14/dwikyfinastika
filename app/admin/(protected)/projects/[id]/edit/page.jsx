import db from '@/lib/db';
import ProjectForm from '@/components/ProjectForm';
import { notFound } from 'next/navigation';

export default function EditProjectPage({ params }) {
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(params.id);
  if (!project) return notFound();
  const parsed = { ...project, tags: JSON.parse(project.tags || '[]') };

  return (
    <div>
      <h1>Edit Proyek</h1>
      <ProjectForm initial={parsed} projectId={params.id} />
    </div>
  );
}
