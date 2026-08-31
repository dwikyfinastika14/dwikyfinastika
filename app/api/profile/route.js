import { NextResponse } from 'next/server';
import { getProfile, updateProfile } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  noStore();

  const profile = await getProfile();
  const firstName = profile.name?.split(' ')[0] || 'Nama';
  const role = profile.role?.toLowerCase() || 'digital development';
  const yearsExperience = profile.years_experience || 1;

  return NextResponse.json({
    ...profile,
    skills: profile.skills || [],
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
    about_notes: profile.about_notes || [
      'Building thoughtful digital products with a focus on clarity, performance, and useful details.',
      'Combining strong technical foundations with a practical, human approach to every project.',
    ],
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
  await updateProfile(body);
  revalidatePath('/');

  return NextResponse.json({ ok: true });
}
