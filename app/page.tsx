'use client';

import { useEffect, useState } from 'react';

interface Video {
  id: string;
  title: string;
  src: string;
}

// Static video data
const videosData = [
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

export default function Home() {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  useEffect(() => {
    // Auto-play first video
    setCurrentVideo(videosData[0]);
  }, []);

  const handleVideoEnd = () => {
    if (currentVideo) {
      const currentIndex = videosData.findIndex(v => v.id === currentVideo.id);
      const nextIndex = (currentIndex + 1) % videosData.length;
      setCurrentVideo(videosData[nextIndex]);
    }
  };

  if (!currentVideo) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-black relative">
      <video
        key={currentVideo.id}
        src={currentVideo.src}
        className="w-full h-full object-contain"
        controls
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        onLoadStart={() => {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'video_load', { 
              video_id: currentVideo.id, 
              video_title: currentVideo.title 
            });
          }
        }}
      />
      <div className="absolute bottom-4 left-4 right-4 text-lg font-bold bg-black/50 p-3 rounded-md z-10">
        {currentVideo.title}
      </div>
    </div>
  );
}