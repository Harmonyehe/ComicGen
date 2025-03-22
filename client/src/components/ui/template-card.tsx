import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, BarChart, BarChart2 } from "lucide-react";

interface TemplateCardProps {
  title: string;
  panelCount: string;
  level: "Beginner" | "Intermediate" | "Pro";
  onClick: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  title,
  panelCount,
  level,
  onClick,
}) => {
  const getLevelIcon = () => {
    switch (level) {
      case "Beginner":
        return <User className="mr-1 h-3 w-3" />;
      case "Intermediate":
        return <BarChart className="mr-1 h-3 w-3" />;
      case "Pro":
        return <BarChart2 className="mr-1 h-3 w-3" />;
      default:
        return <User className="mr-1 h-3 w-3" />;
    }
  };

  const getLevelColor = () => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Pro":
        return "bg-red-100 text-red-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  return (
    <div className="border-3 border-black rounded-md bg-white overflow-hidden shadow-[5px_5px_0px_#2D0E49] hover:-translate-y-1 transition-all duration-200">
      <div className="aspect-w-4 aspect-h-3 relative">
        <div className="w-full h-64 bg-gradient-to-b from-primary/20 to-[#8C52FF]/20 flex items-center justify-center">
          <span className="font-['Bangers'] text-3xl text-[#2D0E49]">{title}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#2D0E49]/80 to-transparent">
          <h3 className="text-white font-['Bangers'] text-lg">{title}</h3>
          <p className="text-white/80 text-sm font-['Nunito']">{panelCount}</p>
        </div>
      </div>
      <div className="p-4 flex justify-between items-center bg-white">
        <div>
          <Badge variant="outline" className={`flex items-center ${getLevelColor()}`}>
            {getLevelIcon()}
            {level}
          </Badge>
        </div>
        <Button
          onClick={onClick}
          size="icon"
          className="rounded-full w-10 h-10 bg-[#8C52FF] hover:bg-[#8C52FF]/90 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-transform"
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default TemplateCard;
