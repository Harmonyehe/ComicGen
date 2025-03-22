import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SearchBar from "@/components/ui/search-bar";
import TemplateCard from "@/components/ui/template-card";
import CommunityCard from "@/components/ui/community-card";
import { MagicWand, GalleryHorizontal, Download } from "lucide-react";

const HomePage = () => {
  const [_, navigate] = useLocation();

  const handleStartComic = () => {
    navigate('/editor');
  };

  const features = [
    {
      icon: <MagicWand className="text-2xl text-[#8C52FF]" />,
      title: "Easy Creation",
      description:
        "No artistic skills needed. Drag & drop characters, backgrounds, and speech bubbles.",
    },
    {
      icon: <GalleryHorizontal className="text-2xl text-primary" />,
      title: "Huge Library",
      description:
        "Thousands of characters, props, and backgrounds to choose from for your comic.",
    },
    {
      icon: <Download className="text-2xl text-[#FF7AC6]" />,
      title: "Export & Share",
      description:
        "Save your comics in multiple formats and share them instantly with friends.",
    },
  ];

  const templates = [
    {
      id: 1,
      title: "Superhero Adventure",
      panelCount: "3-6 panels",
      level: "Beginner",
    },
    {
      id: 2,
      title: "Sci-Fi Explorer",
      panelCount: "4-8 panels",
      level: "Intermediate",
    },
    {
      id: 3,
      title: "Magical Kingdoms",
      panelCount: "6-12 panels",
      level: "Pro",
    },
  ];

  const communityComics = [
    {
      id: 1,
      title: "Space Adventures",
      username: "spacelover",
      likes: 245,
    },
    {
      id: 2,
      title: "Robot Friends",
      username: "robotmaster",
      likes: 189,
    },
    {
      id: 3,
      title: "Magical Forest",
      username: "forestspirit",
      likes: 312,
    },
    {
      id: 4,
      title: "Cyberpunk City",
      username: "neonrider",
      likes: 278,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-background py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="font-['Bangers'] text-4xl sm:text-5xl md:text-6xl tracking-tight text-[#2D0E49] mb-4">
              Create <span className="text-primary">Amazing</span> Comic Strips in <span className="text-[#8C52FF]">Minutes!</span>
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl font-['Nunito'] text-gray-600 mb-8">
              Let your imagination run wild with our easy-to-use comic creator. No drawing skills required!
            </p>
            
            {/* Search/Start Comic Bar */}
            <SearchBar onStart={handleStartComic} />
            
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <Card key={index} className="border border-gray-100 shadow-md">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold font-['Quicksand'] text-[#2D0E49] mb-2">{feature.title}</h3>
                    <p className="text-gray-600 font-['Nunito']">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        
        {/* Background decoration elements */}
        <div className="absolute top-20 left-0 w-32 h-32 bg-primary opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#8C52FF] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-0 w-40 h-40 bg-[#FF7AC6] opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Popular Templates */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-['Bangers'] text-[#2D0E49]">
              Popular <span className="text-primary">Templates</span>
            </h2>
            <p className="mt-2 text-gray-600 font-['Nunito']">
              Get started quickly with our most-loved comic templates
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                title={template.title}
                panelCount={template.panelCount}
                level={template.level}
                onClick={() => navigate('/editor')}
              />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button variant="outline" className="font-bold text-[#8C52FF] border-[#8C52FF] shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
              Browse All Templates <span className="ml-2">→</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Creation Demo */}
      <div className="bg-gradient-to-br from-primary/5 to-[#8C52FF]/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="mb-10 lg:mb-0">
              <h2 className="text-3xl font-['Bangers'] text-[#2D0E49] mb-4">
                Create Your <span className="text-primary">Comic</span> in Three <span className="text-[#8C52FF]">Simple Steps</span>
              </h2>
              <div className="space-y-8 mt-8">
                {[
                  {
                    number: 1,
                    title: "Choose Your Template",
                    description: "Select from dozens of pre-designed templates or start with a blank canvas.",
                    bgColor: "bg-primary",
                  },
                  {
                    number: 2,
                    title: "Add Characters & Dialogue",
                    description: "Drag and drop characters, backgrounds, and speech bubbles to build your story.",
                    bgColor: "bg-[#8C52FF]",
                  },
                  {
                    number: 3,
                    title: "Save & Share",
                    description: "Download your finished comic or share it directly with friends and on social media.",
                    bgColor: "bg-[#FF7AC6]",
                  },
                ].map((step) => (
                  <div key={step.number} className="flex">
                    <div className={`flex-shrink-0 h-12 w-12 rounded-full ${step.bgColor} text-white flex items-center justify-center font-['Bangers'] text-xl shadow-md`}>
                      {step.number}
                    </div>
                    <div className="ml-6">
                      <h3 className="text-xl font-bold font-['Quicksand'] text-[#2D0E49]">{step.title}</h3>
                      <p className="mt-2 text-gray-600 font-['Nunito']">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10">
                <Button 
                  onClick={() => navigate('/editor')}
                  className="bg-primary hover:bg-primary/90 text-white py-3 px-8 rounded-md font-['Bangers'] text-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  Try It Now — It's Free!
                </Button>
              </div>
            </div>
            
            {/* Editor Preview */}
            <div className="relative">
              <div className="border-2 border-black rounded-md bg-white p-4 shadow-[5px_5px_0px_#2D0E49] hover:-translate-y-1 transition-all duration-200">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-100 p-3 rounded border-2 border-black relative">
                    <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400">Character 1</span>
                    </div>
                    <div className="mt-2 p-2 bg-white rounded-lg border-2 border-black relative">
                      <p className="text-sm font-['Bangers']">"We need to save the city!"</p>
                      <div className="absolute -bottom-3 left-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-black transform -translate-x-1/2 rotate-45"></div>
                    </div>
                  </div>
                  <div className="bg-gray-100 p-3 rounded border-2 border-black relative">
                    <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400">Background</span>
                    </div>
                  </div>
                  <div className="bg-gray-100 p-3 rounded border-2 border-black relative">
                    <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400">Special Effect</span>
                    </div>
                  </div>
                  <div className="bg-gray-100 p-3 rounded border-2 border-black relative">
                    <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400">Character 2</span>
                    </div>
                    <div className="mt-2 p-2 bg-white rounded-lg border-2 border-black relative">
                      <p className="text-sm font-['Bangers']">"I've got your back!"</p>
                      <div className="absolute -bottom-3 left-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-black transform -translate-x-1/2 rotate-45"></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between">
                  <Button variant="outline" size="sm" className="text-[#8C52FF]">
                    + Add Panel
                  </Button>
                  <Button variant="outline" size="sm" className="text-primary">
                    <Download className="h-4 w-4 mr-1" /> Export
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Community Showcase */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-['Bangers'] text-[#2D0E49]">
              From Our <span className="text-primary">Creative</span> Community
            </h2>
            <p className="mt-2 text-gray-600 font-['Nunito']">
              Check out what other comic creators are making
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityComics.map((comic) => (
              <CommunityCard
                key={comic.id}
                title={comic.title}
                username={comic.username}
                likes={comic.likes}
              />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button variant="outline" className="font-bold text-[#8C52FF] border-[#8C52FF] shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
              Explore Community Comics <span className="ml-2">→</span>
            </Button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary to-[#8C52FF] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-['Bangers'] text-white mb-4">
            Ready to Create Your First Comic?
          </h2>
          <p className="max-w-2xl mx-auto text-white/90 text-lg font-['Nunito'] mb-8">
            Join thousands of creators who are bringing their stories to life with ComicCraft.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/editor')}
              className="bg-white text-primary hover:bg-gray-50 font-['Bangers'] text-lg px-8 py-3 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              Start Creating Now
            </Button>
            <Button 
              variant="outline" 
              className="bg-[#2D0E49]/20 text-white hover:bg-[#2D0E49]/30 font-['Bangers'] text-lg px-8 py-3 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              Watch Tutorial
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#2D0E49] text-white/80 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <span className="text-2xl font-['Bangers'] text-white">
                Comic<span className="text-primary">Craft</span>
              </span>
              <p className="mt-4 text-sm">
                Create, share, and discover amazing comic strips with our easy-to-use tools.
              </p>
              <div className="mt-6 flex space-x-4">
                {['instagram', 'twitter-x', 'facebook-circle', 'youtube'].map((social) => (
                  <a key={social} href="#" className="text-white/80 hover:text-primary">
                    <i className={`ri-${social}-line text-xl`}></i>
                  </a>
                ))}
              </div>
            </div>
            
            {[
              {
                title: "Product",
                links: ["Features", "Templates", "Pricing", "Updates"],
              },
              {
                title: "Resources",
                links: ["Community", "Tutorial Videos", "Blog", "Help Center"],
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Contact", "Privacy Policy"],
              },
            ].map((section) => (
              <div key={section.title}>
                <h3 className="text-lg font-['Quicksand'] font-bold mb-4">{section.title}</h3>
                <ul className="space-y-3 text-sm">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="hover:text-primary">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-12 pt-6 border-t border-white/10 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} ComicCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating action button (mobile only) */}
      <div className="fixed bottom-6 right-6 md:hidden z-50">
        <Button 
          onClick={() => navigate('/editor')}
          className="w-14 h-14 rounded-full bg-primary text-white shadow-md hover:shadow-lg flex items-center justify-center hover:-translate-y-1 transition-all"
        >
          <span className="text-2xl">+</span>
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
