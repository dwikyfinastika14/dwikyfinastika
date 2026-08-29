import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET(request, { params }) {
  const experience = db.prepare('SELECT * FROM experiences WHERE id = ?').get(params.id);
  if (!experience) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ...experience, tags: JSON.parse(experience.tags || '[]') });
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

  db.prepare(
    `UPDATE experiences
     SET company = ?, title = ?, period = ?, location = ?, tags = ?, sort_order = ?
     WHERE id = ?`
  ).run(
    company,
    title || '',
    period || '',
    location || '',
    JSON.stringify(tags || []),
    Number(sort_order) || 0,
    params.id
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  db.prepare('DELETE FROM experiences WHERE id = ?').run(params.id);
  return NextResponse.json({ ok: true });
}
