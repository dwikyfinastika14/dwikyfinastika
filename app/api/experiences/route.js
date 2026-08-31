import { NextResponse } from 'next/server';
import { createExperience, listExperiences } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  noStore();
  return NextResponse.json(await listExperiences());
}

export async function POST(request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { company, title, period, location, tags, sort_order } = body;

  if (!company) {
    return NextResponse.json({ error: 'Perusahaan wajib diisi' }, { status: 400 });
  }

  const id = await createExperience({
    company,
    title: title || '',
    period: period || '',
    location: location || '',
    tags: tags || [],
    sort_order: Number(sort_order) || 0,
  });
  revalidatePath('/');

  return NextResponse.json({ id });
}
