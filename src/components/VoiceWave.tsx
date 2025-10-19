import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface VoiceWaveProps {
  isActive: boolean;
  isSpeaking: boolean;
}

export const VoiceWave = ({ isActive, isSpeaking }: VoiceWaveProps) => {
  const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    if (isActive || isSpeaking) {
      const interval = setInterval(() => {
        setBars(Array.from({ length: 5 }, () => Math.random() * 100 + 20));
      }, 100);
      return () => clearInterval(interval);
    } else {
      setBars([30, 30, 30, 30, 30]);
    }
  }, [isActive, isSpeaking]);

  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {bars.map((height, i) => (
        <div
          key={i}
          className={cn(
            "w-2 rounded-full transition-all duration-100",
            isSpeaking ? "bg-accent" : isActive ? "bg-primary" : "bg-muted-foreground/30"
          )}
          style={{
            height: `${height}%`,
            transition: 'height 0.1s ease-in-out',
          }}
        />
      ))}
    </div>
  );
};
