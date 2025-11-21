import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';

interface Video {
  id: string;
  title: string;
  src: string;
}

// 🛡️ Secure server-side data fetch
async function getVideosData(): Promise<Video[]> {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://free-videx-icu.pages.dev'  // GANTI INI SETELAH DEPLOY!
      : 'http://localhost:3000';
    
    const res = await fetch(`${baseUrl}/videos.json`, {
      cache: 'force-cache' // Cache untuk performance
    });
    
    if (!res.ok) throw new Error('Failed to fetch videos');
    return await res.json();
  } catch {
    // Fallback data
    return [
      {
        id: 'bigbuck',
        title: 'Big Buck Bunny',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      }
    ];
  }
}

type Props = {
  params: { id: string };
};

export async function generateStaticParams() {
  const videosData = await getVideosData();
  return videosData.map((video) => ({ id: video.id }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const videosData = await getVideosData();
  const video = videosData.find((v) => v.id === params.id);
  if (!video) return {};

  return {
    title: `${video.title} - Video Player`,
    description: `Watch ${video.title} full HD free streaming.`,
    openGraph: {
      title: video.title,
      description: `Stream ${video.title} HD!`,
      type: 'video.other',
      url: `/f/${params.id}`,
    },
    twitter: {
      card: 'player',
      title: video.title,
    },
  };
}

export default async function VideoPage({ params }: Props) {
  const videosData = await getVideosData();
  const video = videosData.find((v) => v.id === params.id);
  if (!video) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": video.title,
            "description": `Full HD ${video.title}`,
            "thumbnailUrl": `/thumb/${video.id}.png`,
            "contentUrl": video.src,
            "embedUrl": `/f/${video.id}`,
            "uploadDate": "2024-01-01T00:00:00Z",
          }),
        }}
      />
      <div className="h-screen w-screen bg-black relative">
        <video
          src={video.src}
          className="w-full h-full object-contain"
          controls
          autoPlay
          muted
          playsInline
          onLoadStart={() => {
            if (typeof gtag !== 'undefined') {
              gtag('event', 'video_load', { 
                video_id: video.id, 
                video_title: video.title 
              });
            }
          }}
        />
        <div className="absolute bottom-4 left-4 right-4 text-lg font-bold bg-black/50 p-3 rounded-md z-10">
          {video.title}
        </div>
      </div>
    </>
  );
}