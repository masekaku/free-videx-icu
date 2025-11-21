import { NextResponse } from 'next/server';

interface Video {
  id: string;
  title: string;
  src: string;
}

export async function GET(request: Request) {
  try {
    // 🛡️ Fetch from protected JSON (server-side only)
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://yourdomain.com'  // GANTI INI SETELAH DEPLOY!
      : 'http://localhost:3000';
    
    const videosData: Video[] = await fetch(`${baseUrl}/videos.json`).then(r => r.json());
    
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('id');
    
    // 🛡️ ONLY serve specific video data, not entire array
    if (videoId) {
      const video = videosData.find(v => v.id === videoId);
      if (!video) {
        return NextResponse.json({ error: 'Video not found' }, { status: 404 });
      }
      return NextResponse.json(video);
    }
    
    // 🛡️ For home page, return ONLY first video (security)
    const firstVideo = videosData[0];
    return NextResponse.json([firstVideo]);
    
  } catch (error) {
    // Fallback hardcoded first video only
    const fallbackVideo: Video = {
      id: 'bigbuck',
      title: 'Big Buck Bunny',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    };
    return NextResponse.json([fallbackVideo]);
  }
}