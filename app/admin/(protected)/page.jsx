'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadProjects() {
    setLoading(true);
    const res = await fetch('/api/projects');
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function handleDelete(id) {
    if (!confirm('Hapus proyek ini? Tindakan ini tidak bisa dibatalkan.')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    loadProjects();
  }

  return (
    <div>
      <div className="admin-header">
        <h1>Proyek</h1>
        <Link href="/admin/projects/new" className="btn-admin-primary">
          + Tambah Proyek
        </Link>
      </div>

      {loading ? (
        <p>Memuat...</p>
      ) : projects.length === 0 ? (
        <p>Belum ada proyek. Klik &ldquo;Tambah Proyek&rdquo; untuk mulai.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Judul</th>
              <th>Tahun</th>
              <th>Tags</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.title}</td>
                <td>{project.year}</td>
                <td>{project.tags.join(', ')}</td>
                <td className="admin-table-actions">
                  <Link href={`/admin/projects/${project.id}/edit`}>Edit</Link>
                  <button onClick={() => handleDelete(project.id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
