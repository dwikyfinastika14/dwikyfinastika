import { NextResponse } from 'next/server';
import { createProject, listProjects } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  noStore();
  return NextResponse.json(await listProjects());
}

export async function POST(request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const { title, description, image, tags, link, repo, year, sort_order } = body;

  if (!title) {
    return NextResponse.json({ error: 'Judul wajib diisi' }, { status: 400 });
  }

  const id = await createProject({
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
  return NextResponse.json({ id });
}
