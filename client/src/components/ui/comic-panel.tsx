import React, { useState } from "react";
import { X, Plus, Edit, MessageSquare, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface SpeechBubbleProps {
  text: string;
  onTextChange: (text: string) => void;
  onRemove: () => void;
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  text,
  onTextChange,
  onRemove,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);

  const handleSave = () => {
    onTextChange(editText);
    setIsEditing(false);
  };

  return (
    <div className="mt-2 p-2 bg-white rounded-lg border-2 border-black relative">
      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="min-h-[60px] text-sm border-none focus-visible:ring-1 focus-visible:ring-primary"
          />
          <div className="flex justify-end space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(false)}
              className="h-7 px-2 text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="h-7 px-2 text-xs bg-primary hover:bg-primary/90"
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm font-['Bangers']">{text}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-1 right-1 text-gray-500 hover:text-primary"
          >
            <Edit className="h-3 w-3" />
          </button>
          <button
            onClick={onRemove}
            className="absolute top-1 right-5 text-gray-500 hover:text-red-500"
          >
            <X className="h-3 w-3" />
          </button>
          <div className="absolute -bottom-3 left-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-black transform -translate-x-1/2 rotate-45"></div>
        </>
      )}
    </div>
  );
};

interface ComicPanelProps {
  onRemove?: () => void;
}

const ComicPanel: React.FC<ComicPanelProps> = ({ onRemove }) => {
  const [speechBubbles, setSpeechBubbles] = useState<string[]>([]);

  const addSpeechBubble = () => {
    setSpeechBubbles([...speechBubbles, "Type your text here..."]);
  };

  const updateSpeechBubble = (index: number, text: string) => {
    const newBubbles = [...speechBubbles];
    newBubbles[index] = text;
    setSpeechBubbles(newBubbles);
  };

  const removeSpeechBubble = (index: number) => {
    const newBubbles = [...speechBubbles];
    newBubbles.splice(index, 1);
    setSpeechBubbles(newBubbles);
  };

  return (
    <div className="border-2 border-black rounded-md bg-white p-4 shadow-[5px_5px_0px_#2D0E49] hover:-translate-y-1 transition-all duration-200 relative">
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 z-10"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <div className="bg-gray-100 p-3 rounded border-2 border-black relative min-h-[150px]">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="flex space-x-2 mb-2">
            <Button
              size="sm"
              variant="outline"
              onClick={addSpeechBubble}
              className="text-xs"
            >
              <MessageSquare className="h-3 w-3 mr-1" /> Add Speech
            </Button>
            <Button size="sm" variant="outline" className="text-xs">
              <Plus className="h-3 w-3 mr-1" /> Add Character
            </Button>
          </div>
          <Button size="sm" variant="outline" className="text-xs">
            <Plus className="h-3 w-3 mr-1" /> Add Background
          </Button>
        </div>

        {speechBubbles.map((bubble, index) => (
          <SpeechBubble
            key={index}
            text={bubble}
            onTextChange={(text) => updateSpeechBubble(index, text)}
            onRemove={() => removeSpeechBubble(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ComicPanel;
