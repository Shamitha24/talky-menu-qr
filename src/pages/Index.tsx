import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Utensils, MessageSquare, Sparkles } from 'lucide-react';
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
                Menus that <span className="text-primary">talk back</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
                Have a conversation with your menu. Order smarter, eat better at UTD.
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
                  <Utensils className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Just Ask</h3>
                <p className="text-muted-foreground">
                  Talk to the menu like you're talking to a friend. Ask about dishes, prices, ingredients - it understands you.
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Ordering</h3>
                <p className="text-muted-foreground">
                  Get personalized recommendations, dietary info, and send your order directly to your phone when ready.
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">UTD Made Easy</h3>
                <p className="text-muted-foreground">
                  Works seamlessly with your Comet Card, knows dining hours, and helps you make the most of your meal plan.
                </p>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="container mx-auto px-4 py-16 text-center">
            <Card className="p-12 max-w-3xl mx-auto bg-gradient-to-br from-primary/5 to-accent/5">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Your Menu is Waiting to Chat
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                No more guessing. No more waiting. Just talk to your menu and get exactly what you want.
              </p>
              <Button 
                size="lg"
                onClick={() => setShowChat(true)}
                className="text-lg px-8 py-6"
              >
                Start Talking Now
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
              <h2 className="text-3xl font-bold mb-2">Your Talking Menu</h2>
              <p className="text-muted-foreground">Ask me anything about what's available today!</p>
            </div>
            <MenuChat />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
