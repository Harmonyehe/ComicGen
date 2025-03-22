import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

interface SearchBarProps {
  onStart?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onStart }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const [_, navigate] = useLocation();

  const handleStartComic = () => {
    if (onStart) {
      onStart();
    } else {
      if (user) {
        navigate("/editor");
      } else {
        navigate("/auth");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto mb-10 relative">
      <div className="flex flex-col md:flex-row shadow-xl rounded-xl overflow-hidden border-2 border-dark/10 bg-white">
        <div className="flex-1 px-4 py-3 flex">
          <div className="min-w-10 text-center pt-2">
            <Search className="h-5 w-5 text-[#8C52FF]" />
          </div>
          <input
            type="text"
            placeholder="Search templates or start from scratch..."
            className="w-full pl-3 pr-10 py-2 font-['Nunito'] focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          onClick={handleStartComic}
          className="bg-primary hover:bg-primary/90 px-6 py-3 text-white font-['Bangers'] text-lg tracking-wide shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
        >
          Start New Comic
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
