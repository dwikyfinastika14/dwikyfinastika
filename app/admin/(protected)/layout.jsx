import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import AdminNav from '@/components/AdminNav';

export default function AdminProtectedLayout({ children }) {
  if (!isAuthenticated()) {
    redirect('/admin/login');
  }

  return (
    <div className="admin-shell">
      <AdminNav />
      <div className="admin-content">{children}</div>
    </div>
  );
}
