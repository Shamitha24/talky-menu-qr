import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AvatarAssistantProps {
  isSpeaking: boolean;
  isListening: boolean;
}

export const AvatarAssistant = ({ isSpeaking, isListening }: AvatarAssistantProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={cn(
      "flex flex-col items-center gap-6 py-8 transition-all duration-700",
      mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    )}>
      <div className="relative">
        {/* Animated outer rings */}
        <div className="absolute inset-0 -m-8">
          <div
            className={cn(
              "absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 transition-all duration-1000 ease-in-out",
              isSpeaking && "animate-ping"
            )}
          />
          <div
            className={cn(
              "absolute inset-0 rounded-full bg-gradient-to-r from-secondary/20 via-primary/20 to-accent/20 transition-all duration-1000 ease-in-out delay-300",
              isSpeaking && "animate-ping"
            )}
          />
        </div>

        {/* Outer glow ring */}
        <div
          className={cn(
            "absolute -inset-4 rounded-full bg-gradient-to-r from-primary via-accent to-secondary blur-2xl transition-all duration-700 ease-in-out",
            isSpeaking || isListening ? "opacity-70 scale-110" : "opacity-40 scale-100"
          )}
        />
        
        {/* Main avatar circle with smooth transitions */}
        <div
          className={cn(
            "relative w-36 h-36 rounded-full bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center transition-all duration-500 ease-out",
            "shadow-lg shadow-primary/50",
            isSpeaking && "scale-105 shadow-2xl shadow-primary/70",
            isListening && "scale-105 shadow-2xl shadow-accent/70"
          )}
          style={{
            animation: isSpeaking ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
          }}
        >
          {/* Inner circle with backdrop blur */}
          <div className="w-32 h-32 rounded-full bg-background/95 backdrop-blur-xl flex items-center justify-center shadow-inner">
            {/* Avatar face */}
            <div className="relative w-24 h-24 flex flex-col items-center justify-center gap-3">
              {/* Eyes with blink animation */}
              <div className="flex gap-4 justify-center">
                <div
                  className={cn(
                    "w-4 h-4 rounded-full bg-gradient-to-br from-primary to-accent transition-all duration-300 ease-out shadow-md",
                    isListening && "scale-110 shadow-lg shadow-accent/50 animate-pulse"
                  )}
                />
                <div
                  className={cn(
                    "w-4 h-4 rounded-full bg-gradient-to-br from-primary to-accent transition-all duration-300 ease-out shadow-md",
                    isListening && "scale-110 shadow-lg shadow-accent/50 animate-pulse"
                  )}
                />
              </div>
              
              {/* Mouth - smooth animation based on state */}
              <div className="flex justify-center items-center h-8">
                {isSpeaking ? (
                  <div className="flex gap-1.5 items-end h-full">
                    <div 
                      className="w-1.5 bg-gradient-to-t from-primary to-accent rounded-full transition-all duration-150"
                      style={{
                        animation: 'bounce 0.6s ease-in-out infinite',
                        height: '40%'
                      }}
                    />
                    <div 
                      className="w-1.5 bg-gradient-to-t from-primary to-accent rounded-full transition-all duration-150"
                      style={{
                        animation: 'bounce 0.6s ease-in-out 0.1s infinite',
                        height: '80%'
                      }}
                    />
                    <div 
                      className="w-1.5 bg-gradient-to-t from-primary to-accent rounded-full transition-all duration-150"
                      style={{
                        animation: 'bounce 0.6s ease-in-out 0.2s infinite',
                        height: '60%'
                      }}
                    />
                    <div 
                      className="w-1.5 bg-gradient-to-t from-primary to-accent rounded-full transition-all duration-150"
                      style={{
                        animation: 'bounce 0.6s ease-in-out 0.3s infinite',
                        height: '90%'
                      }}
                    />
                    <div 
                      className="w-1.5 bg-gradient-to-t from-primary to-accent rounded-full transition-all duration-150"
                      style={{
                        animation: 'bounce 0.6s ease-in-out 0.4s infinite',
                        height: '50%'
                      }}
                    />
                  </div>
                ) : (
                  <div 
                    className={cn(
                      "h-2.5 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out shadow-sm",
                      isListening ? "w-10" : "w-8"
                    )}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sound waves with smooth animation */}
        {isSpeaking && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="absolute -left-12 w-8 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full opacity-60"
              style={{ animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' }}
            />
            <div 
              className="absolute -left-16 w-10 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full opacity-40"
              style={{ animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) 0.2s infinite' }}
            />
            <div 
              className="absolute -right-12 w-8 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full opacity-60"
              style={{ animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) 0.1s infinite' }}
            />
            <div 
              className="absolute -right-16 w-10 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full opacity-40"
              style={{ animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) 0.3s infinite' }}
            />
          </div>
        )}

        {/* Listening indicator waves */}
        {isListening && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="absolute w-40 h-40 rounded-full border-2 border-accent/30"
              style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }}
            />
            <div 
              className="absolute w-44 h-44 rounded-full border border-accent/20"
              style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) 0.5s infinite' }}
            />
          </div>
        )}
      </div>

      <div className={cn(
        "text-center transition-all duration-500",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}>
        <p className={cn(
          "text-base font-semibold transition-colors duration-300",
          isSpeaking ? "text-primary" : isListening ? "text-accent" : "text-foreground"
        )}>
          {isSpeaking ? "Speaking..." : isListening ? "Listening..." : "Ready to help!"}
        </p>
        <p className="text-sm text-muted-foreground mt-1.5 font-medium">
          UTD Dining Assistant
        </p>
      </div>
    </div>
  );
};
