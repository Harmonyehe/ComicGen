import { useState } from "react";
import { useLocation } from "wouter";
import { SearchIcon, Sparkles, BookOpen, Zap, Users, LayoutTemplate, Palette } from "lucide-react";

import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/create?title=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  const features = [
    {
      title: "Create Stunning Comics",
      description: "Design professional-looking comics with our intuitive editor.",
      icon: <BookOpen className="h-12 w-12 text-primary" />,
      color: "bg-comic-blue",
      effect: "POW!"
    },
    {
      title: "Multiple Formats",
      description: "Choose from webtoon, manga, Instagram, or classic comic styles.",
      icon: <Zap className="h-12 w-12 text-primary" />,
      color: "bg-comic-orange",
      effect: "ZAP!"
    },
    {
      title: "AI Character Generation",
      description: "Generate unique characters that match your story's style.",
      icon: <Sparkles className="h-12 w-12 text-primary" />,
      color: "bg-comic-green",
      effect: "BOOM!"
    },
  ];
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="relative mb-6">
            <h1 className="comic-title text-5xl md:text-6xl lg:text-8xl font-bold float">
              COMITALE
            </h1>
            <div className="sound-effect opacity-100 -top-8 right-0 bg-comic-yellow rotate-12 pulse">
              POW!
            </div>
          </div>
          
          <p className="text-xl md:text-2xl mb-10 max-w-3xl comic-subtitle relative">
            Create amazing comics in minutes with our easy-to-use platform!
            <span className="absolute -right-4 top-1/2 transform -translate-y-1/2 rotate-12 text-4xl text-comic-red">!</span>
          </p>
          
          {/* Search Bar */}
          <div className="w-full max-w-2xl mb-8 relative">
            <div className="comic-burst opacity-100 top-0 right-0 bg-comic-yellow transform -translate-y-full translate-x-1/4 pulse">
              START HERE!
            </div>
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Enter a title for your comic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="comic-search py-6 pl-6 pr-12 text-lg rounded-full border-2 border-comic-dark"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full p-2 h-12 w-12 bg-comic-red hover:bg-comic-red/90"
                disabled={!searchQuery.trim()}
              >
                <SearchIcon className="h-5 w-5" />
              </Button>
            </form>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <Button
              onClick={() => navigate("/create")}
              size="lg"
              className="action-btn text-lg relative bg-comic-red hover:bg-comic-red/90 border-2 border-comic-dark"
            >
              <span className="relative z-10">Start New Comic</span>
              <span className="sound-effect -top-10 -right-5 opacity-0 hover:opacity-100 transition-opacity">ZAP!</span>
            </Button>
            <Button
              onClick={() => navigate("/comics")}
              variant="outline"
              size="lg"
              className="action-btn border-2 border-comic-dark text-comic-dark hover:bg-comic-dark/5"
            >
              My Comics
            </Button>
          </div>
        </div>
        
        {/* Halftone divider */}
        <div className="halftone-divider"></div>
        
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="comic-panel pop-in overflow-hidden" 
              style={{
                animationDelay: `${index * 0.2}s`,
                transform: `rotate(${index % 2 === 0 ? '1deg' : '-1deg'})`
              }}
            >
              <div className={`${feature.color} h-2`}></div>
              <div className="relative">
                <CardHeader className="pb-2">
                  <div className="mb-4 flex justify-center p-4 bg-gray-50 rounded-full w-20 h-20 mx-auto">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-2xl text-center comic-subtitle">{feature.title}</CardTitle>
                </CardHeader>
                <div className="absolute top-0 right-0">
                  <div className="comic-burst text-sm opacity-0 hover:opacity-100 transition-opacity">
                    {feature.effect}
                  </div>
                </div>
              </div>
              <CardContent>
                <p className="text-center">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Halftone divider */}
        <div className="halftone-divider"></div>
        
        {/* Example Comic Section */}
        <div className="mb-16">
          <h2 className="comic-subtitle text-3xl text-center mb-8 float">Create Comics Like These!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="comic-panel bg-comic-yellow/20 p-4 pb-8">
              <div className="dialogue-bubble mb-4">
                <p className="comic-subtitle text-lg">Check out our awesome comic creator!</p>
              </div>
              <div className="bg-white p-4 comic-panel transform rotate-0">
                <div className="flex justify-center mb-2">
                  <div className="bg-gray-200 w-32 h-32 rounded-full flex items-center justify-center">
                    <Sparkles className="h-16 w-16 text-gray-500" />
                  </div>
                </div>
                <p className="text-center comic-subtitle">Your characters come to life!</p>
              </div>
            </div>
            <div className="comic-panel bg-comic-blue/20 p-4 pb-8">
              <div className="dialogue-bubble mb-4">
                <p className="comic-subtitle text-lg">Multiple formats available!</p>
              </div>
              <div className="grid grid-cols-2 gap-2 p-3">
                <div className="bg-white p-2 comic-panel transform rotate-0 flex items-center justify-center h-24">
                  <Zap className="h-10 w-10 text-gray-500" />
                </div>
                <div className="bg-white p-2 comic-panel transform rotate-0 flex items-center justify-center h-24">
                  <BookOpen className="h-10 w-10 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Halftone divider */}
        <div className="halftone-divider"></div>
        
        {/* CTA Section */}
        <div className="comic-panel bg-white p-8 text-center transform -rotate-1 border-4 border-comic-dark relative overflow-hidden mb-8">
          <div className="absolute top-0 left-0 w-full h-2 bg-comic-yellow"></div>
          <div className="comic-burst right-4 top-0 bg-comic-red text-white">FREE!</div>
          <h2 className="comic-subtitle text-4xl font-bold mb-4 text-comic-red">Ready to Create Your Comic?</h2>
          <p className="mb-8 text-comic-dark text-xl max-w-2xl mx-auto">
            Join thousands of creators who've brought their stories to life with our platform.
          </p>
          <Button 
            onClick={() => navigate("/register")} 
            size="lg" 
            className="action-btn text-xl py-7 px-10 bg-comic-green hover:bg-comic-green/90 border-2 border-comic-dark"
          >
            Sign Up Free
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}