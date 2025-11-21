'use client';

import { useEffect, useState } from 'react';

interface Video {
  id: string;
  title: string;
  src: string;
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  useEffect(() => {
    // 🛡️ Use secure API instead of direct JSON access
    fetch('/api/videos')
      .then(r => r.json())
      .then((data: Video[]) => {
        setVideos(data);
        setCurrentVideo(data[0]); // Auto-play first video
      })
      .catch(() => {
        // Fallback jika API gagal
        const fallbackVideo: Video = {
          id: 'bigbuck',
          title: 'Big Buck Bunny',
          src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
        };
        setVideos([fallbackVideo]);
        setCurrentVideo(fallbackVideo);
      });
  }, []);

  const handleVideoEnd = () => {
    if (videos.length > 0 && currentVideo) {
      const currentIndex = videos.findIndex(v => v.id === currentVideo.id);
      const nextIndex = (currentIndex + 1) % videos.length;
      
      // 🛡️ Fetch next video securely via API
      fetch(`/api/videos?id=${videos[nextIndex].id}`)
        .then(r => r.json())
        .then((nextVideo: Video) => {
          setCurrentVideo(nextVideo);
        })
        .catch(() => {
          setCurrentVideo(videos[nextIndex]);
        });
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