"use client"

import React, { useRef, useEffect, useState } from 'react';

interface ScratchCardProps {
  imageUrl: string;
  onComplete: () => void;
  threshold?: number;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({
  imageUrl,
  onComplete,
  threshold = 70,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 400;

    // Fill with scratch layer
    ctx.fillStyle = '#9333ea';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch to Reveal', canvas.width / 2, canvas.height / 2);
  }, []);

  const scratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || completed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    checkCompletion();
  };

  const checkCompletion = () => {
    const canvas = canvasRef.current;
    if (!canvas || completed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) transparent++;
    }

    const percentScratched = (transparent / (pixels.length / 4)) * 100;

    if (percentScratched > threshold) {
      setCompleted(true);
      onComplete();
    }
  };

  return (
    <div className="relative w-[400px] h-[400px] mx-auto">
      <img
        src={imageUrl}
        alt="Hidden content"
        className="absolute inset-0 w-full h-full object-cover rounded-lg blur-sm"
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-pointer rounded-lg"
        onMouseDown={() => setIsDrawing(true)}
        onMouseUp={() => setIsDrawing(false)}
        onMouseMove={(e) => isDrawing && scratch(e)}
        onTouchStart={() => setIsDrawing(true)}
        onTouchEnd={() => setIsDrawing(false)}
        onTouchMove={(e) => scratch(e)}
      />
    </div>
  );
};
