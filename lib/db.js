import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import os from 'os';

const dataDir = process.env.VERCEL
  ? path.join(os.tmpdir(), 'portfolio-cms')
  : path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'portfolio.db');
const db = new Database(dbPath);
db.pragma(`journal_mode = ${process.env.VERCEL ? 'DELETE' : 'WAL'}`);

db.exec(`
  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    name TEXT,
    role TEXT,
    bio TEXT,
    skills TEXT,
    email TEXT,
    github TEXT,
    linkedin TEXT,
    instagram TEXT,
    location TEXT,
    years_experience INTEGER,
    hero_title TEXT,
    hero_intro TEXT,
    availability_text TEXT,
    primary_cta_label TEXT,
    primary_cta_href TEXT,
    secondary_cta_label TEXT,
    secondary_cta_href TEXT,
    about_heading TEXT,
    about_note_1 TEXT,
    about_note_2 TEXT,
    experience_summary TEXT,
    contact_heading TEXT
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    image TEXT,
    tags TEXT,
    link TEXT,
    repo TEXT,
    year TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS experiences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT NOT NULL,
    title TEXT,
    period TEXT,
    location TEXT,
    tags TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

const profileColumns = new Set(db.prepare('PRAGMA table_info(profile)').all().map((column) => column.name));
const ensureProfileColumn = (name) => {
  if (!profileColumns.has(name)) {
    db.prepare(`ALTER TABLE profile ADD COLUMN ${name} TEXT`).run();
    profileColumns.add(name);
  }
};

[
  'hero_title',
  'hero_intro',
  'availability_text',
  'primary_cta_label',
  'primary_cta_href',
  'secondary_cta_label',
  'secondary_cta_href',
  'about_heading',
  'about_note_1',
  'about_note_2',
  'experience_summary',
  'contact_heading',
].forEach(ensureProfileColumn);

const cleanText = (value) => {
  if (typeof value !== 'string') return value;

  return value
    .replace(/\u00e2\u0080\u0094/g, '-')
    .replace(/\u00e2\u0080\u00a6/g, '...')
    .replace(/\u00e2\u0086\u0092/g, '->')
    .replace(/\u00e2\u0086\u0093/g, 'v')
    .replace(/\u00c2\u00a9/g, '(c)')
    .replace(/\u00e2\u009c\u0093/g, 'OK');
};

const profileText = db.prepare('SELECT bio FROM profile WHERE id = 1').get();
if (profileText?.bio) {
  const cleanBio = cleanText(profileText.bio);
  if (cleanBio !== profileText.bio) {
    db.prepare('UPDATE profile SET bio = ? WHERE id = 1').run(cleanBio);
  }
}

const existingProfile = db.prepare('SELECT id FROM profile WHERE id = 1').get();
if (!existingProfile) {
  db.prepare(
    `INSERT INTO profile
      (
        id, name, role, bio, skills, email, github, linkedin, instagram, location, years_experience,
        hero_title, hero_intro, availability_text, primary_cta_label, primary_cta_href,
        secondary_cta_label, secondary_cta_href, about_heading, about_note_1, about_note_2,
        experience_summary, contact_heading
      )
     VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    'Nama Kamu Di Sini',
    'Fullstack Developer',
    'Placeholder bio - ganti lewat halaman admin di /admin/profile. Ceritakan pengalaman kamu, fokus keahlian, dan apa yang membuat cara kerjamu berbeda.',
    JSON.stringify(['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS']),
    'nama@email.com',
    'https://github.com/username',
    'https://linkedin.com/in/username',
    'https://instagram.com/username',
    'Jakarta, Indonesia',
    3,
    "I'm Nama, crafting my journey in fullstack development.",
    'From early projects to professional milestones, explore the path that shaped me as a developer.',
    'Tersedia untuk proyek',
    'Lihat perjalanan',
    '#about',
    'Download CV',
    '#contact',
    'Core strengths and expertise',
    'Building thoughtful digital products with a focus on clarity, performance, and useful details.',
    'Combining strong technical foundations with a practical, human approach to every project.',
    'Over the past 3+ years, I have worked across different projects and digital products.',
    "Got a project? Let's talk!"
  );
}

const projectCount = db.prepare('SELECT COUNT(*) AS c FROM projects').get().c;
if (projectCount === 0) {
  const seed = db.prepare(
    `INSERT INTO projects (title, description, image, tags, link, repo, year, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );
  seed.run(
    'Nama Proyek Satu',
    'Deskripsi singkat proyek ini - masalah apa yang diselesaikan, pendekatan yang dipakai, dan hasilnya. Ganti lewat halaman admin.',
    '',
    JSON.stringify(['Next.js', 'Tailwind CSS']),
    '',
    '',
    String(new Date().getFullYear()),
    1
  );
  seed.run(
    'Nama Proyek Dua',
    'Deskripsi singkat proyek kedua kamu.',
    '',
    JSON.stringify(['React Native']),
    '',
    '',
    String(new Date().getFullYear() - 1),
    2
  );
  seed.run(
    'Nama Proyek Tiga',
    'Deskripsi singkat proyek ketiga kamu.',
    '',
    JSON.stringify(['Node.js', 'PostgreSQL']),
    '',
    '',
    String(new Date().getFullYear() - 2),
    3
  );
}

const experienceCount = db.prepare('SELECT COUNT(*) AS c FROM experiences').get().c;
if (experienceCount === 0) {
  const profile = db.prepare('SELECT role, location, skills, years_experience FROM profile WHERE id = 1').get();
  const skills = JSON.parse(profile?.skills || '[]');
  const seed = db.prepare(
    `INSERT INTO experiences (company, title, period, location, tags, sort_order)
     VALUES (?, ?, ?, ?, ?, ?)`
  );
  seed.run(
    'Independent Developer',
    profile?.role || 'Fullstack Developer',
    `${profile?.years_experience || 1}+ years - Present`,
    profile?.location || '',
    JSON.stringify(skills.slice(0, 4)),
    1
  );
}

export default db;
