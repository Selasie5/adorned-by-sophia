"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [counter, setCounter] = useState(0);
  const [shouldSlideUp, setShouldSlideUp] = useState(false);

  useEffect(() => {
  
    const duration = 2500; 
    const steps = 100;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setCounter(currentStep);

      if (currentStep >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setShouldSlideUp(true);
          setTimeout(() => {
            onComplete();
          }, 1800); 
        }, 500);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 flex items-end justify-end p-8"
      initial={{ y: 0 }}
      animate={{ y: shouldSlideUp ? "-100%" : 0 }}
      transition={{ 
        duration: 1.8, 
        ease: [0.76, 0, 0.24, 1]
      }}
    >
      <div className="text-white text-3xl md:text-5xl font-light tracking-wider">
        {counter}%
      </div>
    </motion.div>
  );
}
