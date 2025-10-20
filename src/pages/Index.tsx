import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { QrCode, MessageSquare, Sparkles } from 'lucide-react';
import { MenuChat } from '@/components/MenuChat';
import heroImage from '@/assets/hero-restaurant.jpg';
import voiceIcon from '@/assets/voice-icon.png';

const Index = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {!showChat ? (
        <>
          {/* Hero Section */}
          <section className="relative h-[70vh] overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImage})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
            </div>
            <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
              <img src={voiceIcon} alt="Voice Menu" className="w-24 h-24 mb-6 animate-pulse" />
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                UTD Dining <span className="text-primary">Reimagined</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
                Your personal AI dining assistant for UTD campus. Ask about menus, nutrition, hours, and get personalized recommendations.
              </p>
              <Button 
                size="lg" 
                onClick={() => setShowChat(true)}
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
              >
                <MessageSquare className="mr-2" />
                Start Talking to Menu
              </Button>
            </div>
          </section>

          {/* Features Section */}
          <section className="container mx-auto px-4 py-16">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quick Access</h3>
                <p className="text-muted-foreground">
                  Scan QR codes at any UTD dining location or access directly to start your dining experience
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Voice or Text</h3>
                <p className="text-muted-foreground">
                  Ask about today's menu, dietary options, hours, or get recommendations - using voice or text
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Campus-Specific</h3>
                <p className="text-muted-foreground">
                  Information tailored to UTD dining halls, meal plans, and Comet Card compatibility
                </p>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="container mx-auto px-4 py-16 text-center">
            <Card className="p-12 max-w-3xl mx-auto bg-gradient-to-br from-primary/5 to-accent/5">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your UTD Dining?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Chat with your AI assistant now and discover what's available across campus today
              </p>
              <Button 
                size="lg"
                onClick={() => setShowChat(true)}
                className="text-lg px-8 py-6"
              >
                Start UTD Dining Assistant
              </Button>
            </Card>
          </section>
        </>
      ) : (
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => setShowChat(false)}
              className="mb-6"
            >
              ← Back to Home
            </Button>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">UTD Dining Assistant</h2>
              <p className="text-muted-foreground">Ask me anything about UTD dining options!</p>
            </div>
            <MenuChat />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
