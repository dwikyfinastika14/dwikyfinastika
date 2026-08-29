import './globals.css';
import db from '@/lib/db';

export async function generateMetadata() {
  const profile = db.prepare('SELECT name, role, bio FROM profile WHERE id = 1').get();
  return {
    title: `${profile?.name || 'Portfolio'} - ${profile?.role || ''}`.trim(),
    description: profile?.bio || 'Portfolio pribadi - dibuat dengan Next.js.',
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Sans+Condensed:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
