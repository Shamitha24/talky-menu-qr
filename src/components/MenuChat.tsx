import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Send } from 'lucide-react';
import { VoiceWave } from './VoiceWave';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const MenuChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your voice menu assistant. You can ask me about our dishes, ingredients, or recommendations. Try saying 'What appetizers do you have?' or just type your question!"
    }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleSendMessage(transcript);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "Microphone Error",
          description: "Please check your microphone permissions.",
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isProcessing) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('menu-chat', {
        body: { 
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message
      };
      
      setMessages(prev => [...prev, assistantMessage]);

      // Text-to-speech
      if (data.audio) {
        setIsSpeaking(true);
        if (audioRef.current) {
          audioRef.current.pause();
        }
        audioRef.current = new Audio(`data:audio/mp3;base64,${data.audio}`);
        audioRef.current.onended = () => setIsSpeaking(false);
        audioRef.current.play();
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto">
      <Card className="flex-1 overflow-y-auto p-6 space-y-4 bg-card/50 backdrop-blur">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-secondary text-secondary-foreground rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </Card>

      <Card className="mt-4 p-4 bg-card/50 backdrop-blur">
        <div className="flex flex-col gap-4">
          <div className="flex justify-center">
            <VoiceWave isActive={isListening} isSpeaking={isSpeaking} />
          </div>
          
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your question..."
              className="flex-1"
              disabled={isProcessing}
            />
            <Button
              type="button"
              onClick={toggleListening}
              variant={isListening ? "default" : "secondary"}
              size="icon"
              disabled={isProcessing}
            >
              {isListening ? <MicOff /> : <Mic />}
            </Button>
            <Button
              type="submit"
              size="icon"
              disabled={!inputText.trim() || isProcessing}
            >
              <Send />
            </Button>
          </form>
          
          <p className="text-xs text-muted-foreground text-center">
            {isListening ? 'Listening... Speak now!' : isSpeaking ? 'Speaking...' : 'Click the mic or type to ask about our menu'}
          </p>
        </div>
      </Card>
    </div>
  );
};
