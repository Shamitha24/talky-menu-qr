import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Send } from 'lucide-react';
import { VoiceWave } from './VoiceWave';
import { AvatarAssistant } from './AvatarAssistant';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
}

export const MenuChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hey there! I'm your talking menu. Ask me anything about what we're serving today - prices, ingredients, recommendations. I'm here to make ordering easy!",
      suggestions: ["What's good today?", "Show me vegetarian options", "What can I get with my meal plan?"]
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
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [hasGreeted, setHasGreeted] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Greet user on mount with voice
  useEffect(() => {
    if (!hasGreeted && messages.length > 0) {
      setHasGreeted(true);
      const greeting = messages[0].content;
      speakText(greeting);
    }
  }, [hasGreeted, messages]);

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

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      setIsSpeaking(true);
      speechSynthRef.current = new SpeechSynthesisUtterance(text);
      speechSynthRef.current.rate = 1.0;
      speechSynthRef.current.pitch = 1.0;
      speechSynthRef.current.volume = 1.0;
      
      speechSynthRef.current.onend = () => {
        setIsSpeaking(false);
      };
      
      speechSynthRef.current.onerror = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(speechSynthRef.current);
    }
  };

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
        content: data.message,
        suggestions: data.suggestions || []
      };
      
      setMessages(prev => [...prev, assistantMessage]);

      // Use text-to-speech for the response
      speakText(data.message);
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
      {/* Avatar Assistant */}
      <Card className="mb-4 bg-card/50 backdrop-blur">
        <AvatarAssistant isSpeaking={isSpeaking} isListening={isListening} />
      </Card>

      <Card className="flex-1 overflow-y-auto p-6 space-y-4 bg-card/50 backdrop-blur">
        {messages.map((message, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div
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
            {message.role === 'assistant' && message.suggestions && message.suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-start">
                {message.suggestions.map((suggestion, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendMessage(suggestion)}
                    className="text-xs rounded-full bg-accent/50 hover:bg-accent border-accent"
                    disabled={isProcessing}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            )}
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
