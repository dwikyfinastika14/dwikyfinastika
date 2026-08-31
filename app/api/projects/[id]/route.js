import { NextResponse } from 'next/server';
import { deleteProject, getProject, updateProject } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { del } from '@vercel/blob';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request, { params }) {
  noStore();

  const project = await getProject(params.id);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(request, { params }) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const { title, description, image, tags, link, repo, year, sort_order } = body;

  await updateProject(params.id, {
    title,
    description: description || '',
    image: image || '',
    tags: tags || [],
    link: link || '',
    repo: repo || '',
    year: year || '',
    sort_order: Number(sort_order) || 0,
  });
  revalidatePath('/');
  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const project = await getProject(params.id);
  if (project?.image?.startsWith('http')) {
    try {
      await del(project.image);
    } catch (e) {
      // Ignore file cleanup errors so deleting database records still works.
    }
  }
  await deleteProject(params.id);
  revalidatePath('/');
  return NextResponse.json({ ok: true });
}
