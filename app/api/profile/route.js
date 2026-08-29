import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get();
  const firstName = profile.name?.split(' ')[0] || 'Nama';
  const role = profile.role?.toLowerCase() || 'digital development';
  const yearsExperience = profile.years_experience || 1;

  return NextResponse.json({
    ...profile,
    skills: JSON.parse(profile.skills || '[]'),
    hero_title: profile.hero_title || `I'm ${firstName}, crafting my journey in ${role}.`,
    hero_intro:
      profile.hero_intro ||
      'From early projects to professional milestones, explore the path that shaped me as a developer.',
    availability_text: profile.availability_text || 'Tersedia untuk proyek',
    primary_cta_label: profile.primary_cta_label || 'Lihat perjalanan',
    primary_cta_href: profile.primary_cta_href || '#about',
    secondary_cta_label: profile.secondary_cta_label || 'Download CV',
    secondary_cta_href: profile.secondary_cta_href || '#contact',
    about_heading: profile.about_heading || 'Core strengths and expertise',
    about_note_1:
      profile.about_note_1 ||
      'Building thoughtful digital products with a focus on clarity, performance, and useful details.',
    about_note_2:
      profile.about_note_2 ||
      'Combining strong technical foundations with a practical, human approach to every project.',
    experience_summary:
      profile.experience_summary ||
      `Over the past ${yearsExperience}+ years, I have worked across different projects and digital products.`,
    contact_heading: profile.contact_heading || "Got a project? Let's talk!",
  });
}

export async function PUT(request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const {
    name,
    role,
    bio,
    skills,
    email,
    github,
    linkedin,
    instagram,
    location,
    years_experience,
    hero_title,
    hero_intro,
    availability_text,
    primary_cta_label,
    primary_cta_href,
    secondary_cta_label,
    secondary_cta_href,
    about_heading,
    about_note_1,
    about_note_2,
    experience_summary,
    contact_heading,
  } = body;

  db.prepare(
    `UPDATE profile
     SET name = ?, role = ?, bio = ?, skills = ?, email = ?, github = ?, linkedin = ?, instagram = ?,
         location = ?, years_experience = ?, hero_title = ?, hero_intro = ?, availability_text = ?,
         primary_cta_label = ?, primary_cta_href = ?, secondary_cta_label = ?, secondary_cta_href = ?,
         about_heading = ?, about_note_1 = ?, about_note_2 = ?, experience_summary = ?, contact_heading = ?
     WHERE id = 1`
  ).run(
    name,
    role,
    bio,
    JSON.stringify(skills || []),
    email,
    github,
    linkedin,
    instagram,
    location,
    Number(years_experience) || 0,
    hero_title || '',
    hero_intro || '',
    availability_text || '',
    primary_cta_label || '',
    primary_cta_href || '',
    secondary_cta_label || '',
    secondary_cta_href || '',
    about_heading || '',
    about_note_1 || '',
    about_note_2 || '',
    experience_summary || '',
    contact_heading || ''
  );

  return NextResponse.json({ ok: true });
}
