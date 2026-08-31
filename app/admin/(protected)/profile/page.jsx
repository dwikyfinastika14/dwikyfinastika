'use client';

import { useEffect, useState } from 'react';

const defaults = {
  hero_title: '',
  hero_intro: '',
  availability_text: '',
  primary_cta_label: '',
  primary_cta_href: '',
  secondary_cta_label: '',
  secondary_cta_href: '',
  about_heading: '',
  about_notes: ['', ''],
  experience_summary: '',
  contact_heading: '',
};

export default function AdminProfilePage() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    fetch('/api/profile')
      .then((response) => response.json())
      .then((data) => setForm({ ...defaults, ...data, skills: data.skills.join(', ') }));
  }, []);

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        update('image_url', data.url);
        setUploadError('');
      } else {
        setUploadError(data.error || 'Gagal upload gambar');
      }
    } catch (err) {
      setUploadError('Error: ' + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      skills: form.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean),
      about_notes: (form.about_notes || []).filter(note => note.trim() !== ''),
      years_experience: Number(form.years_experience) || 0,
    };
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Gagal menyimpan profil');
    }
  }

  if (!form) return <p>Memuat...</p>;

  return (
    <div>
      <h1>Profil</h1>
      <form className="admin-form admin-form-wide" onSubmit={handleSubmit}>
        <fieldset className="admin-fieldset">
          <legend>Identitas</legend>
          <label>
            Nama
            <input value={form.name || ''} onChange={(e) => update('name', e.target.value)} required />
          </label>
          <label>
            Peran / Tagline
            <input value={form.role || ''} onChange={(e) => update('role', e.target.value)} required />
          </label>
          <label>
            Bio
            <textarea value={form.bio || ''} onChange={(e) => update('bio', e.target.value)} rows={4} />
          </label>
          <label>
            Upload Gambar Profile
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            {uploading && <p style={{ fontSize: '0.875rem', color: '#666' }}>Uploading...</p>}
            {uploadError && <p style={{ fontSize: '0.875rem', color: '#dc2626' }}>{uploadError}</p>}
          </label>
          {form.image_url && (
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Preview Gambar:</p>
              <img
                src={form.image_url}
                alt="Profile preview"
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #ccc'
                }}
              />
            </div>
          )}
          <label>
            Skill (pisahkan dengan koma)
            <input value={form.skills || ''} onChange={(e) => update('skills', e.target.value)} />
          </label>
          <div className="admin-form-row">
            <label>
              Email
              <input value={form.email || ''} onChange={(e) => update('email', e.target.value)} />
            </label>
            <label>
              Lokasi
              <input value={form.location || ''} onChange={(e) => update('location', e.target.value)} />
            </label>
          </div>
          <div className="admin-form-row">
            <label>
              GitHub
              <input value={form.github || ''} onChange={(e) => update('github', e.target.value)} />
            </label>
            <label>
              LinkedIn
              <input value={form.linkedin || ''} onChange={(e) => update('linkedin', e.target.value)} />
            </label>
          </div>
          <div className="admin-form-row">
            <label>
              Instagram
              <input value={form.instagram || ''} onChange={(e) => update('instagram', e.target.value)} />
            </label>
            <label>
              Tahun Pengalaman
              <input
                type="number"
                value={form.years_experience || 0}
                onChange={(e) => update('years_experience', e.target.value)}
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="admin-fieldset">
          <legend>Hero</legend>
          <label>
            Judul Hero
            <textarea value={form.hero_title || ''} onChange={(e) => update('hero_title', e.target.value)} rows={3} />
          </label>
          <label>
            Intro Hero
            <textarea value={form.hero_intro || ''} onChange={(e) => update('hero_intro', e.target.value)} rows={3} />
          </label>
          <label>
            Teks Availability
            <input value={form.availability_text || ''} onChange={(e) => update('availability_text', e.target.value)} />
          </label>
          <div className="admin-form-row">
            <label>
              CTA Utama
              <input value={form.primary_cta_label || ''} onChange={(e) => update('primary_cta_label', e.target.value)} />
            </label>
            <label>
              Link CTA Utama
              <input value={form.primary_cta_href || ''} onChange={(e) => update('primary_cta_href', e.target.value)} />
            </label>
          </div>
          <div className="admin-form-row">
            <label>
              CTA Kedua
              <input value={form.secondary_cta_label || ''} onChange={(e) => update('secondary_cta_label', e.target.value)} />
            </label>
            <label>
              Link CTA Kedua
              <input value={form.secondary_cta_href || ''} onChange={(e) => update('secondary_cta_href', e.target.value)} />
            </label>
          </div>
        </fieldset>

        <fieldset className="admin-fieldset">
          <legend>About</legend>
          <label>
            Heading Kekuatan
            <input value={form.about_heading || ''} onChange={(e) => update('about_heading', e.target.value)} />
          </label>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Catatan Kekuatan (bisa lebih dari 2):</div>
            {(form.about_notes || []).map((note, index) => (
              <div key={index} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Catatan {index + 1}
                  <textarea
                    value={note || ''}
                    onChange={(e) => {
                      const newNotes = [...(form.about_notes || [])];
                      newNotes[index] = e.target.value;
                      update('about_notes', newNotes);
                    }}
                    rows={3}
                    style={{ marginTop: '0.25rem' }}
                  />
                </label>
                {form.about_notes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newNotes = form.about_notes.filter((_, i) => i !== index);
                      update('about_notes', newNotes);
                    }}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Hapus Catatan
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newNotes = [...(form.about_notes || []), ''];
                update('about_notes', newNotes);
              }}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              + Tambah Catatan
            </button>
          </div>
        </fieldset>

        <fieldset className="admin-fieldset">
          <legend>Experience & Contact</legend>
          <label>
            Ringkasan Experience
            <textarea
              value={form.experience_summary || ''}
              onChange={(e) => update('experience_summary', e.target.value)}
              rows={3}
            />
          </label>
          <label>
            Heading Contact
            <input value={form.contact_heading || ''} onChange={(e) => update('contact_heading', e.target.value)} />
          </label>
        </fieldset>

        {error && <p className="admin-error">{error}</p>}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button type="submit" disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan Profil'}
          </button>
          {saved && <span className="admin-saved">Tersimpan OK</span>}
        </div>
      </form>
    </div>
  );
}
