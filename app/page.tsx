"use client"
import {motion} from "framer-motion";
import { listVariants } from "./components/Animation";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.log("Audio playback failed:", error);
        setIsPlaying(false);
      }
    }
  };

  return (
    <main className="relative h-screen flex flex-col justify-center items-center bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat">
<div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent z-10"/>
      
     
      <audio ref={audioRef} loop>
        <source src="/ambient-music.mp3" type="audio/mpeg" />
      </audio>

      
      <div 
        className="absolute top-8 right-8 z-30"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <motion.button
          onClick={togglePlay}
          className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full p-2 shadow-lg transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </motion.button>

        
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 bg-white/10 backdrop-blur-md rounded-lg p-3 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
              </svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
              <span className="text-white text-xs">{Math.round(volume * 100)}%</span>
            </div>
          </motion.div>
        )}
      </div>
      <div className="relative z-20 flex flex-col justify-center items-center  text-center gap-3 p-5">
        <motion.span
        variants={listVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.4}
        
        className="tracking-[1rem] text-sm text-white sub mb-6">ADORNED BY SOPHIA</motion.span>
 <motion.h1
 variants={listVariants}
 initial="hidden"
 whileInView="visible"
 viewport={{ once: true }}
 custom={0.8}
 className="text-white text-6xl">For Beauty & For Glory</motion.h1>
        <motion.p
        variants={listVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={1.6}
        className="text-white sub text-base">Your favourite pieces. A seamless new way to shop.</motion.p>
      
      </div>
 <div className="absolute bottom-8 right-8 z-20">
 <motion.p
 variants={listVariants}
 initial="hidden"
 whileInView="visible"
 viewport={{ once: true }}
 custom={4}
 className="text-white text-lg">...coming soon</motion.p>
        
       </div>
     
       
    </main>
  );
}
