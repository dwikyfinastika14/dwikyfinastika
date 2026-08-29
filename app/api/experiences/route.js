import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  const rows = db.prepare('SELECT * FROM experiences ORDER BY sort_order ASC, id ASC').all();
  const experiences = rows.map((experience) => ({
    ...experience,
    tags: JSON.parse(experience.tags || '[]'),
  }));
  return NextResponse.json(experiences);
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

  const stmt = db.prepare(
    `INSERT INTO experiences (company, title, period, location, tags, sort_order)
     VALUES (?, ?, ?, ?, ?, ?)`
  );
  const info = stmt.run(
    company,
    title || '',
    period || '',
    location || '',
    JSON.stringify(tags || []),
    Number(sort_order) || 0
  );

  return NextResponse.json({ id: info.lastInsertRowid });
}
