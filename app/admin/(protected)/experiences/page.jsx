'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadExperiences() {
    setLoading(true);
    const res = await fetch('/api/experiences');
    const data = await res.json();
    setExperiences(data);
    setLoading(false);
  }

  useEffect(() => {
    loadExperiences();
  }, []);

  async function handleDelete(id) {
    if (!confirm('Hapus experience ini? Tindakan ini tidak bisa dibatalkan.')) return;
    await fetch(`/api/experiences/${id}`, { method: 'DELETE' });
    loadExperiences();
  }

  return (
    <div>
      <div className="admin-header">
        <h1>Experience</h1>
        <Link href="/admin/experiences/new" className="btn-admin-primary">
          + Tambah Experience
        </Link>
      </div>

      {loading ? (
        <p>Memuat...</p>
      ) : experiences.length === 0 ? (
        <p>Belum ada experience. Klik &ldquo;Tambah Experience&rdquo; untuk mulai.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Perusahaan</th>
              <th>Posisi</th>
              <th>Periode</th>
              <th>Tags</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {experiences.map((experience) => (
              <tr key={experience.id}>
                <td>{experience.company}</td>
                <td>{experience.title}</td>
                <td>{experience.period}</td>
                <td>{experience.tags.join(', ')}</td>
                <td className="admin-table-actions">
                  <Link href={`/admin/experiences/${experience.id}/edit`}>Edit</Link>
                  <button onClick={() => handleDelete(experience.id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
