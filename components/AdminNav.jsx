'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminNav() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <nav className="admin-nav">
      <div className="admin-nav-brand">ADMIN - CMS PORTFOLIO</div>
      <div className="admin-nav-links">
        <Link href="/admin">Proyek</Link>
        <Link href="/admin/experiences">Experience</Link>
        <Link href="/admin/profile">Profil</Link>
        <a href="/" target="_blank" rel="noreferrer">
          Lihat Situs -&gt;
        </a>
        <button onClick={handleLogout}>Keluar</button>
      </div>
    </nav>
  );
}
