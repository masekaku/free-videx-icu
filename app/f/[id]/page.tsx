import { notFound } from 'next/navigation';

interface Video {
  id: string;
  title: string;
  src: string;
}

// Static video data untuk build time
const videosData: Video[] = [
  {
    id: 'bigbuck',
    title: 'Big Buck Bunny',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: 'elephants',
    title: 'Elephants Dream', 
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
  },
  {
    id: 'forrest',
    title: 'Forrest',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Forrest.mp4'
  }
];

export async function generateStaticParams() {
  return videosData.map((video) => ({ id: video.id }));
}

export default function VideoPage({ params }: { params: { id: string } }) {
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

export async function generateMetadata({ params }: { params: { id: string } }) {
  const video = videosData.find((v) => v.id === params.id);
  if (!video) return {};

  return {
    title: `${video.title} - Video Player`,
    description: `Watch ${video.title} full HD free streaming.`,
  };
}