import { cookies } from 'next/headers';
import crypto from 'crypto';

export const COOKIE_NAME = 'admin_session';

function expectedToken() {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  return crypto.createHash('sha256').update(adminPassword).digest('hex');
}

export function tokenForPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function isAuthenticated() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return token === expectedToken();
}
