import React, { useState, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ComicPanel from "@/components/ui/comic-panel";
import {
  Plus,
  Save,
  Download,
  ArrowLeft,
  Loader2,
  Undo,
  Redo,
  Copy,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { exportToImage } from "@/lib/canvas-utils";

export default function ComicEditor() {
  const { id } = useParams();
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const editorRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState("Untitled Comic");
  const [panelCount, setPanelCount] = useState(4);
  const [saving, setSaving] = useState(false);

  // Fetch comic if editing an existing one
  const { data: comic, isLoading: isLoadingComic } = useQuery({
    queryKey: id ? [`/api/comics/${id}`] : null,
    enabled: !!id,
  });

  // Set title if comic is loaded
  React.useEffect(() => {
    if (comic) {
      setTitle(comic.title);
      // We would also set panels data here
    }
  }, [comic]);

  const saveMutation = useMutation({
    mutationFn: async (data: { title: string; content: any }) => {
      const endpoint = id ? `/api/comics/${id}` : "/api/comics";
      const method = id ? "PATCH" : "POST";
      const res = await apiRequest(method, endpoint, data);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/comics"] });
      toast({
        title: "Comic saved!",
        description: "Your comic was saved successfully.",
      });
      if (!id) {
        navigate(`/editor/${data.id}`);
      }
    },
    onError: (error) => {
      toast({
        title: "Error saving comic",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to save comics",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    // Collect panel data
    const content = {
      panels: Array(panelCount).fill({
        // We would collect actual panel data here
        elements: []
      }),
    };

    saveMutation.mutate({ title, content });
  };

  const handleExport = async () => {
    if (!editorRef.current) return;
    
    setSaving(true);
    try {
      const dataUrl = await exportToImage(editorRef.current);
      
      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Comic exported!",
        description: "Your comic has been downloaded as an image.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your comic.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddPanel = () => {
    setPanelCount(panelCount + 1);
  };

  const handleRemovePanel = (index: number) => {
    if (panelCount > 1) {
      setPanelCount(panelCount - 1);
    }
  };

  if (isLoadingComic) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-bold max-w-[300px]"
              />
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>
                  <Undo className="h-4 w-4 mr-1" /> Undo
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <Redo className="h-4 w-4 mr-1" /> Redo
                </Button>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="text-[#8C52FF] border-[#8C52FF]"
            >
              {saveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save
            </Button>
            <Button
              onClick={handleExport}
              disabled={saving}
              className="bg-primary hover:bg-primary/90"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Export
            </Button>
          </div>
        </div>

        {/* Comic Editor */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <div ref={editorRef} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: panelCount }).map((_, index) => (
                <ComicPanel
                  key={index}
                  onRemove={
                    panelCount > 1 ? () => handleRemovePanel(index) : undefined
                  }
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleAddPanel}
              variant="outline"
              className="text-[#8C52FF] border-[#8C52FF]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Panel
            </Button>
          </div>
        </div>

        {/* Tools Panel */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <h3 className="text-lg font-bold mb-4 font-['Quicksand'] text-[#2D0E49]">
            Comic Elements
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {["Characters", "Backgrounds", "Speech Bubbles", "Effects", "Text", "Props"].map(
              (tool) => (
                <Button
                  key={tool}
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center text-sm"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                    <Copy className="h-5 w-5 text-[#8C52FF]" />
                  </div>
                  {tool}
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
