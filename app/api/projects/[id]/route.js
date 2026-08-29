import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(params.id);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ...project, tags: JSON.parse(project.tags || '[]') });
}

export async function PUT(request, { params }) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const { title, description, image, tags, link, repo, year, sort_order } = body;

  db.prepare(
    `UPDATE projects
     SET title = ?, description = ?, image = ?, tags = ?, link = ?, repo = ?, year = ?, sort_order = ?
     WHERE id = ?`
  ).run(
    title,
    description || '',
    image || '',
    JSON.stringify(tags || []),
    link || '',
    repo || '',
    year || '',
    Number(sort_order) || 0,
    params.id
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(params.id);
  if (project?.image) {
    const filePath = path.join(process.cwd(), 'public', project.image);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        // ignore file cleanup errors
      }
    }
  }
  db.prepare('DELETE FROM projects WHERE id = ?').run(params.id);
  return NextResponse.json({ ok: true });
}
