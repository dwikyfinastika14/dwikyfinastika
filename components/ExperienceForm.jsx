'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ExperienceForm({ initial, experienceId }) {
  const router = useRouter();
  const [form, setForm] = useState({
    company: initial?.company || '',
    title: initial?.title || '',
    period: initial?.period || '',
    location: initial?.location || '',
    tags: initial?.tags?.join(', ') || '',
    sort_order: initial?.sort_order ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
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
    const url = experienceId ? `/api/experiences/${experienceId}` : '/api/experiences';
    const method = experienceId ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      router.push('/admin/experiences');
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Gagal menyimpan experience');
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <label>
        Perusahaan / Organisasi
        <input value={form.company} onChange={(e) => update('company', e.target.value)} required />
      </label>
      <label>
        Posisi
        <input value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="Fullstack Developer" />
      </label>
      <div className="admin-form-row">
        <label>
          Periode
          <input value={form.period} onChange={(e) => update('period', e.target.value)} placeholder="2024 - Sekarang" />
        </label>
        <label>
          Lokasi
          <input value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="Jakarta / Remote" />
        </label>
      </div>
      <label>
        Tags (pisahkan dengan koma)
        <input value={form.tags} onChange={(e) => update('tags', e.target.value)} placeholder="React, Next.js, Tailwind" />
      </label>
      <label>
        Urutan tampil
        <input type="number" value={form.sort_order} onChange={(e) => update('sort_order', e.target.value)} />
      </label>
      {error && <p className="admin-error">{error}</p>}
      <button type="submit" disabled={saving}>
        {saving ? 'Menyimpan...' : 'Simpan Experience'}
      </button>
    </form>
  );
}
