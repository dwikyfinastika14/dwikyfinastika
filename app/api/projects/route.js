import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  const rows = db.prepare('SELECT * FROM projects ORDER BY sort_order ASC, id ASC').all();
  const projects = rows.map((p) => ({ ...p, tags: JSON.parse(p.tags || '[]') }));
  return NextResponse.json(projects);
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

  const stmt = db.prepare(
    `INSERT INTO projects (title, description, image, tags, link, repo, year, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const info = stmt.run(
    title,
    description || '',
    image || '',
    JSON.stringify(tags || []),
    link || '',
    repo || '',
    year || '',
    Number(sort_order) || 0
  );
  return NextResponse.json({ id: info.lastInsertRowid });
}
