import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Format file tidak didukung' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = path.extname(file.name) || '.jpg';
  const safeName = path.basename(file.name, ext).replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  const filename = `uploads/${Date.now()}-${safeName || 'image'}${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    return NextResponse.json({ url: blob.url });
  }

  if (process.env.VERCEL) {
    return NextResponse.json(
      { error: 'BLOB_READ_WRITE_TOKEN belum diset. Buat Vercel Blob store untuk upload gambar.' },
      { status: 500 }
    );
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  const localFilename = path.basename(filename);
  fs.writeFileSync(path.join(uploadDir, localFilename), buffer);

  return NextResponse.json({ url: `/uploads/${localFilename}` });
}
