import React from "react";
import { Heart } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CommunityCardProps {
  title: string;
  username: string;
  likes: number;
}

const CommunityCard: React.FC<CommunityCardProps> = ({
  title,
  username,
  likes,
}) => {
  return (
    <div className="border-3 border-black rounded-md bg-white overflow-hidden shadow-[5px_5px_0px_#2D0E49] hover:-translate-y-1 transition-all duration-200">
      <div className="w-full h-48 bg-gradient-to-br from-primary/20 via-[#8C52FF]/20 to-[#FF7AC6]/20 flex items-center justify-center">
        <span className="font-['Bangers'] text-2xl text-[#2D0E49]">{title}</span>
      </div>
      <div className="p-3">
        <h3 className="font-['Quicksand'] font-bold text-[#2D0E49]">{title}</h3>
        <div className="flex items-center mt-2">
          <Avatar className="w-6 h-6">
            <AvatarFallback className="bg-[#8C52FF] text-white text-xs">
              {username.substring(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="ml-2 text-sm text-gray-600">@{username}</span>
          <div className="ml-auto flex">
            <span className="text-sm text-gray-500 flex items-center">
              <Heart className="h-3.5 w-3.5 mr-1" /> {likes}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;
