import { NextResponse } from 'next/server';

interface Video {
  id: string;
  title: string;
  src: string;
}

export async function GET() {
  try {
    // 🛡️ Secure data fetch
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://yourdomain.com'  // GANTI INI SETELAH DEPLOY!
      : 'http://localhost:3000';
    
    const videosData: Video[] = await fetch(`${baseUrl}/videos.json`).then(r => r.json());
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>1.0</priority>
  </url>
  ${videosData.map(video => `
  <url>
    <loc>${baseUrl}/f/${video.id}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>0.9</priority>
    <video:video>
      <video:title>${video.title}</video:title>
      <video:description>Watch ${video.title} full HD free</video:description>
      <video:content_loc>${video.src}</video:content_loc>
    </video:video>
  </url>
  `).join('')}
</urlset>`;

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
      },
    });
  } catch (error) {
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}