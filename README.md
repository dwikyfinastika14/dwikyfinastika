# Portfolio + CMS (Next.js + SQLite)

Portfolio pribadi dengan halaman admin bawaan (CMS sederhana) untuk menambah, mengedit,
dan menghapus proyek tanpa perlu menyentuh kode.

## Isi konten saat ini

Semua teks masih **placeholder** ("Nama Kamu Di Sini", dst) — silakan ganti lewat
halaman admin setelah project jalan (lihat langkah di bawah).

## Cara menjalankan (lokal)

1. Install dependency:
   ```bash
   npm install
   ```

2. Salin file environment:
   ```bash
   cp .env.example .env
   ```
   Buka `.env` dan ganti `ADMIN_PASSWORD` dengan password kamu sendiri.

3. Jalankan mode development:
   ```bash
   npm run dev
   ```

4. Buka:
   - Situs publik: http://localhost:3000
   - Admin/CMS: http://localhost:3000/admin (login pakai `ADMIN_PASSWORD` dari `.env`)

Database SQLite (`data/portfolio.db`) otomatis dibuat saat pertama kali dijalankan,
lengkap dengan data placeholder (1 profil + 3 contoh proyek).

## Cara pakai CMS

- **Tambah proyek**: masuk ke `/admin` → "Tambah Proyek" → isi judul, deskripsi, upload
  gambar, tags, link demo/repo, tahun, dan urutan tampil.
- **Edit / hapus proyek**: dari daftar proyek di `/admin`, klik "Edit" atau "Hapus".
- **Edit profil**: menu "Profil" di admin — nama, peran, bio, skill, email, GitHub,
  LinkedIn, Instagram, lokasi, tahun pengalaman. Semua langsung tampil di halaman utama
  setelah disimpan.
- Gambar yang diunggah disimpan di `public/uploads/`.

## Struktur project

```
app/
  page.jsx                     → halaman utama (server component, ambil data dari SQLite)
  layout.jsx                   → layout root + font
  globals.css                  → semua styling (tema "lembar gambar teknik / blueprint")
  admin/
    login/page.jsx             → halaman login admin
    (protected)/               → semua halaman di sini butuh login
      layout.jsx                 → penjaga akses (redirect ke /login jika belum masuk)
      page.jsx                   → dashboard daftar proyek
      profile/page.jsx           → form edit profil
      projects/new/page.jsx      → form tambah proyek
      projects/[id]/edit/page.jsx→ form edit proyek
  api/
    auth/login, auth/logout    → set/hapus cookie sesi admin
    projects, projects/[id]    → CRUD proyek (POST/PUT/DELETE butuh login)
    profile                    → get/update profil (PUT butuh login)
    upload                     → upload gambar ke public/uploads
components/                    → Hero, About, Skills, Projects, Contact, ProjectForm, dll
lib/
  db.js                        → koneksi SQLite + auto-migrate + seed data placeholder
  auth.js                      → cek status login dari cookie
data/portfolio.db              → database SQLite (dibuat otomatis, jangan di-commit ke git)
```

## Tentang desain

Tampilan mengambil metafora "lembar gambar teknik" (blueprint/engineering drawing) —
cocok untuk profil developer: grid biru di hero seperti kertas gambar, "title block"
ala lembar teknik untuk info nama/peran/pengalaman, dan pembatas antar-bagian bergaya
garis dimensi. Warna dan font bisa kamu sesuaikan di `app/globals.css` (variabel CSS
di bagian atas file, misalnya `--blueprint-bg`, `--annotation`).

## Keamanan & catatan sebelum deploy publik

- Autentikasi admin di project ini sengaja **sederhana** (satu password di `.env`,
  cocok untuk pemakaian pribadi/lokal). Untuk publik, sebaiknya ganti dengan auth yang
  lebih matang (mis. NextAuth) sebelum dipakai serius.
- Project ini pakai **Next.js 14.2.35** (versi stabil terbaru di jalur 14.x). Sebelum
  deploy ke internet publik, jalankan `npm audit` dan pertimbangkan upgrade ke Next.js
  versi terbaru, karena beberapa celah keamanan Next.js baru diperbaiki di versi yang
  lebih baru (butuh sedikit penyesuaian kode karena ada perubahan API antar versi).
- **Database SQLite** cocok untuk jalan di lokal atau VPS/self-host (file `data/portfolio.db`
  persisten). Kalau nanti deploy ke platform serverless seperti **Vercel**, filesystem-nya
  tidak permanen — kamu perlu migrasi ke database seperti Postgres/Supabase agar data
  proyek dan profil tidak hilang tiap deploy. Bagian yang perlu diganti hanya `lib/db.js`
  dan query di masing-masing file `app/api/*/route.js`; struktur front-end tidak perlu
  diubah.

## Menambah proyek baru ke depannya

Cukup lewat `/admin` — tidak perlu edit kode. Kalau butuh field tambahan (misalnya
kategori proyek), bisa ditambahkan di `lib/db.js` (kolom tabel `projects`),
`components/ProjectForm.jsx` (form input), dan `app/api/projects/route.js` /
`app/api/projects/[id]/route.js` (query create/update).
