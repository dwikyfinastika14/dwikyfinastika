import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(request) {
  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Password salah' }, { status: 401 });
  }

  const token = crypto.createHash('sha256').update(adminPassword).digest('hex');
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
