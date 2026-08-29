'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProjectForm({ initial, projectId }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    image: initial?.image || '',
    tags: initial?.tags?.join(', ') || '',
    link: initial?.link || '',
    repo: initial?.repo || '',
    year: initial?.year || String(new Date().getFullYear()),
    sort_order: initial?.sort_order ?? 0,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json().catch(() => ({}));
    setUploading(false);
    if (res.ok) {
      update('image', data.url);
    } else {
      setError(data.error || 'Gagal mengunggah gambar');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      sort_order: Number(form.sort_order) || 0,
    };
    const url = projectId ? `/api/projects/${projectId}` : '/api/projects';
    const method = projectId ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Gagal menyimpan proyek');
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <label>
        Judul
        <input value={form.title} onChange={(e) => update('title', e.target.value)} required />
      </label>
      <label>
        Deskripsi
        <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={4} required />
      </label>
      <label>
        Gambar
        <input type="file" accept="image/*" onChange={handleUpload} />
        {uploading && <span>Mengunggah...</span>}
        {form.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.image} alt="Pratinjau" className="admin-image-preview" />
        )}
      </label>
      <label>
        Tags (pisahkan dengan koma)
        <input value={form.tags} onChange={(e) => update('tags', e.target.value)} placeholder="React, Next.js, Tailwind" />
      </label>
      <label>
        Link Demo
        <input value={form.link} onChange={(e) => update('link', e.target.value)} placeholder="https://..." />
      </label>
      <label>
        Link Repo
        <input value={form.repo} onChange={(e) => update('repo', e.target.value)} placeholder="https://github.com/..." />
      </label>
      <div className="admin-form-row">
        <label>
          Tahun
          <input value={form.year} onChange={(e) => update('year', e.target.value)} />
        </label>
        <label>
          Urutan tampil
          <input type="number" value={form.sort_order} onChange={(e) => update('sort_order', e.target.value)} />
        </label>
      </div>
      {error && <p className="admin-error">{error}</p>}
      <button type="submit" disabled={saving}>
        {saving ? 'Menyimpan...' : 'Simpan Proyek'}
      </button>
    </form>
  );
}
