import { ButtonHTMLAttributes, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume, VolumeX, Pause, Play } from 'lucide-react';
import { useSpeech } from '@/hooks/use-speech';
import { cn } from '@/lib/utils';

interface SpeechButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  icon?: boolean;
  showLabel?: boolean;
}

export function SpeechButton({
  text,
  variant = 'outline',
  size = 'icon',
  icon = true,
  showLabel = false,
  className,
  ...props
}: SpeechButtonProps) {
  const { speak, cancel, isSpeaking, isPaused, resume, pause } = useSpeech();
  const [isHovering, setIsHovering] = useState(false);
  
  // If text changes while speaking, restart speech
  useEffect(() => {
    if (isSpeaking) {
      speak(text);
    }
  }, [text, isSpeaking, speak]);
  
  const handleClick = () => {
    if (isSpeaking) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      speak(text);
    }
  };
  
  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    cancel();
  };
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={handleClick}
        className={cn(
          'speech-button',
          isSpeaking && 'speech-speaking',
          className
        )}
        aria-label={isSpeaking ? 'Stop speaking' : 'Speak text'}
        {...props}
      >
        {icon ? (
          <>
            {isSpeaking ? (
              isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />
            ) : (
              <Volume className="h-4 w-4" />
            )}
            {showLabel && (
              <span className="ml-2">
                {isSpeaking ? 
                  (isPaused ? 'Resume' : 'Pause') : 
                  'Listen'
                }
              </span>
            )}
          </>
        ) : (
          <span>
            {isSpeaking ? 
              (isPaused ? 'Resume reading' : 'Pause reading') : 
              'Read aloud'
            }
          </span>
        )}
      </Button>
      
      {/* Stop button overlay that appears on hover when speaking */}
      {isSpeaking && isHovering && !isPaused && (
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 shadow-md"
          onClick={handleStop}
          aria-label="Stop speaking"
        >
          <VolumeX className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}