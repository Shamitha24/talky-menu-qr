import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AvatarAssistantProps {
  isSpeaking: boolean;
  isListening: boolean;
}

export const AvatarAssistant = ({ isSpeaking, isListening }: AvatarAssistantProps) => {
  const [pulseAnimation, setPulseAnimation] = useState(false);

  useEffect(() => {
    if (isSpeaking || isListening) {
      setPulseAnimation(true);
    } else {
      setPulseAnimation(false);
    }
  }, [isSpeaking, isListening]);

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div className="relative">
        {/* Outer glow ring */}
        <div
          className={cn(
            "absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent to-secondary blur-xl transition-all duration-500",
            pulseAnimation ? "opacity-60 scale-110 animate-pulse" : "opacity-30 scale-100"
          )}
        />
        
        {/* Main avatar circle */}
        <div
          className={cn(
            "relative w-32 h-32 rounded-full bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center transition-all duration-300",
            pulseAnimation && "scale-110"
          )}
        >
          {/* Inner circle */}
          <div className="w-28 h-28 rounded-full bg-background/90 backdrop-blur flex items-center justify-center">
            {/* Avatar face */}
            <div className="relative w-20 h-20">
              {/* Eyes */}
              <div className="flex gap-3 justify-center mb-2">
                <div
                  className={cn(
                    "w-3 h-3 rounded-full bg-primary transition-all duration-300",
                    isListening && "bg-accent animate-pulse"
                  )}
                />
                <div
                  className={cn(
                    "w-3 h-3 rounded-full bg-primary transition-all duration-300",
                    isListening && "bg-accent animate-pulse"
                  )}
                />
              </div>
              
              {/* Mouth - animated based on speaking */}
              <div className="flex justify-center">
                {isSpeaking ? (
                  <div className="flex gap-1 items-end">
                    <div className="w-1 h-2 bg-primary rounded-full animate-[bounce_0.5s_ease-in-out_infinite]" />
                    <div className="w-1 h-4 bg-primary rounded-full animate-[bounce_0.5s_ease-in-out_0.1s_infinite]" />
                    <div className="w-1 h-3 bg-primary rounded-full animate-[bounce_0.5s_ease-in-out_0.2s_infinite]" />
                    <div className="w-1 h-2 bg-primary rounded-full animate-[bounce_0.5s_ease-in-out_0.3s_infinite]" />
                  </div>
                ) : (
                  <div className="w-8 h-2 rounded-full bg-primary" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sound waves when speaking */}
        {isSpeaking && (
          <>
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-1 bg-primary/60 rounded-full animate-ping" />
            <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-1 bg-primary/60 rounded-full animate-ping delay-150" />
          </>
        )}
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-foreground">
          {isSpeaking ? "Speaking..." : isListening ? "Listening..." : "Ready to help!"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          UTD Dining Assistant
        </p>
      </div>
    </div>
  );
};
