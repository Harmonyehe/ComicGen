import { useState } from "react";
import { useLocation } from "wouter";
import { SearchIcon, Sparkles, BookOpen, Zap } from "lucide-react";

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
    },
    {
      title: "Multiple Formats",
      description: "Choose from webtoon, manga, Instagram, or classic comic styles.",
      icon: <Zap className="h-12 w-12 text-primary" />,
    },
    {
      title: "AI Character Generation",
      description: "Generate unique characters that match your story's style.",
      icon: <Sparkles className="h-12 w-12 text-primary" />,
    },
  ];
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <h1 className="comic-title text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            Comic Creator
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl comic-subtitle">
            Create amazing comics in minutes with our easy-to-use platform
          </p>
          
          {/* Search Bar */}
          <div className="w-full max-w-2xl mb-8">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Enter a title for your comic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="comic-search py-6 pl-6 pr-12 text-lg rounded-full shadow-lg"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full p-2 h-12 w-12"
                disabled={!searchQuery.trim()}
              >
                <SearchIcon className="h-5 w-5" />
              </Button>
            </form>
          </div>
          
          <div className="flex gap-4">
            <Button
              onClick={() => navigate("/create")}
              size="lg"
              className="action-btn text-lg"
            >
              Start New Comic
            </Button>
            <Button
              onClick={() => navigate("/comics")}
              variant="outline"
              size="lg"
            >
              My Comics
            </Button>
          </div>
        </div>
        
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="comic-panel pop-in" style={{animationDelay: `${index * 0.1}s`}}>
              <CardHeader className="pb-2">
                <div className="mb-2 flex justify-center">{feature.icon}</div>
                <CardTitle className="text-xl text-center comic-subtitle">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="comic-panel bg-white p-8 text-center">
          <h2 className="comic-subtitle text-3xl font-bold mb-4">Ready to Create Your Comic?</h2>
          <p className="mb-6 text-muted-foreground">
            Join thousands of creators who've brought their stories to life with our platform.
          </p>
          <Button onClick={() => navigate("/register")} size="lg" className="action-btn">
            Sign Up Free
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}