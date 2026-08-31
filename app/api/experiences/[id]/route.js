import { NextResponse } from 'next/server';
import { deleteExperience, getExperience, updateExperience } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request, { params }) {
  noStore();

  const experience = await getExperience(params.id);
  if (!experience) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(experience);
}

export async function PUT(request, { params }) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { company, title, period, location, tags, sort_order } = body;

  if (!company) {
    return NextResponse.json({ error: 'Perusahaan wajib diisi' }, { status: 400 });
  }

  await updateExperience(params.id, {
    company,
    title: title || '',
    period: period || '',
    location: location || '',
    tags: tags || [],
    sort_order: Number(sort_order) || 0,
  });
  revalidatePath('/');

  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await deleteExperience(params.id);
  revalidatePath('/');
  return NextResponse.json({ ok: true });
}
