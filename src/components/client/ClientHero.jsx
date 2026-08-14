import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const VIDEOS = [
  "https://res.cloudinary.com/drb7rukn7/video/upload/v1786344542/bookverse/video/wszwafa18chn5psar7am.mp4",
  "https://res.cloudinary.com/drb7rukn7/video/upload/v1786345396/bookverse/video/e1hqhvgfxarobsgjitqz.mp4",
  "/Video and photo/Over_the_shoulder_shot_of_a_p.mp4"
];

export default function ClientHero({ onExplore, onStoryClick }) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);

  const handleVideoEnded = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % VIDEOS.length);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(e => console.error("Video replay failed:", e));
    }
  }, [currentVideoIndex]);

  return (
    <div className="relative w-full h-[500px] lg:h-[600px] mb-8 overflow-hidden shadow-xl rounded-none sm:rounded-xl">
      <video
        key={currentVideoIndex}
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnded}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        src={VIDEOS[currentVideoIndex]}
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent"></div>
      
      {/* Text & Button Overlay */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-20">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white leading-[1.15] mb-4 max-w-2xl font-bold tracking-tight">
          Discover Nepal's Literary Treasures
        </h1>
        <p className="text-stone-200 text-sm sm:text-base lg:text-lg leading-relaxed mb-8 max-w-xl font-medium">
          From timeless classics to modern voices — explore stories that shape our culture.
        </p>
        <button 
          onClick={onExplore}
          className="w-fit px-8 py-3.5 bg-[#d4a017] hover:bg-[#b8860b] text-stone-900 font-bold rounded-full transition-transform hover:scale-105 shadow-lg text-sm tracking-wide"
        >
          Shop Now
        </button>
      </div>
    </div>
  );
}