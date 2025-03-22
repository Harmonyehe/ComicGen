import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  PanelTop, 
  Users, 
  Settings, 
  Trash2, 
  Layout, 
  Pencil,
  Image,
  Type,
  Download
} from "lucide-react";

import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Comic, Page, Character } from "@shared/schema";

export function ComicEditorPage() {
  const [match, params] = useRoute("/edit/:id");
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("pages");
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  
  // Get the comic ID from the URL params
  const comicId = params?.id;
  
  // Fetch comic data
  const { data: comic, isLoading: isLoadingComic, error: comicError } = useQuery<Comic>({
    queryKey: [`/api/comics/${comicId}`],
    enabled: !!comicId,
  });
  
  // Fetch pages
  const { data: pages, isLoading: isLoadingPages } = useQuery<Page[]>({
    queryKey: [`/api/comics/${comicId}/pages`],
    enabled: !!comicId,
  });
  
  // Fetch characters
  const { data: characters, isLoading: isLoadingCharacters } = useQuery<Character[]>({
    queryKey: [`/api/comics/${comicId}/characters`],
    enabled: !!comicId,
  });
  
  // Save page mutation
  const saveMutation = useMutation({
    mutationFn: (pageData: Partial<Page>) => {
      return apiRequest(`/api/pages/${pageData.id}`, {
        method: "PATCH",
        body: JSON.stringify(pageData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/comics/${comicId}/pages`] });
    },
  });
  
  // Create new page mutation
  const createPageMutation = useMutation({
    mutationFn: (pageData: { comicId: string; pageNumber: number }) => {
      return apiRequest(`/api/comics/${comicId}/pages`, {
        method: "POST",
        body: JSON.stringify({
          comicId: pageData.comicId,
          pageNumber: pageData.pageNumber,
          content: JSON.stringify({ panels: [], dialogues: [] }),
        }),
      });
    },
    onSuccess: (newPage) => {
      queryClient.invalidateQueries({ queryKey: [`/api/comics/${comicId}/pages`] });
      setSelectedPageId(newPage.id);
    },
  });
  
  // Create new character mutation
  const createCharacterMutation = useMutation({
    mutationFn: (characterData: { name: string; comicId: string }) => {
      return apiRequest(`/api/comics/${comicId}/characters`, {
        method: "POST",
        body: JSON.stringify({
          comicId: characterData.comicId,
          name: characterData.name,
          description: "",
          imageUrl: "",
          isGenerated: true,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/comics/${comicId}/characters`] });
    },
  });
  
  // If there are pages, select the first one by default
  useEffect(() => {
    if (pages && pages.length > 0 && !selectedPageId) {
      setSelectedPageId(pages[0].id);
    }
  }, [pages, selectedPageId]);
  
  // Loading and error states
  if (isLoadingComic) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading comic...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (comicError || !comic) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <Card className="w-full max-w-lg p-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Comic Not Found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find the comic you're looking for. It may have been deleted or you don't have permission to view it.
              </p>
              <Button onClick={() => navigate("/comics")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to My Comics
              </Button>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  // Handle adding a new page
  const handleAddPage = () => {
    const newPageNumber = pages ? pages.length + 1 : 1;
    createPageMutation.mutate({
      comicId,
      pageNumber: newPageNumber,
    });
  };
  
  // Handle adding a new character
  const handleAddCharacter = () => {
    // In a complete app, this would open a modal to add character details
    // For now, create a placeholder character
    createCharacterMutation.mutate({
      comicId,
      name: `Character ${characters ? characters.length + 1 : 1}`,
    });
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/comics")}>
              <ArrowLeft size={16} className="mr-2" /> Back
            </Button>
            <h1 className="text-2xl font-bold">{comic.title}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="space-x-1">
              <Download size={16} />
              <span>Export</span>
            </Button>
            <Button size="sm" className="space-x-1 action-btn">
              <Save size={16} />
              <span>Save</span>
            </Button>
          </div>
        </div>
        
        {/* Main Editor Layout */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left Sidebar */}
          <div className="col-span-2 border-r pr-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="pages" className="text-xs">
                  <PanelTop size={16} className="mb-1" />
                  <span className="block">Pages</span>
                </TabsTrigger>
                <TabsTrigger value="characters" className="text-xs">
                  <Users size={16} className="mb-1" />
                  <span className="block">Characters</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="text-xs">
                  <Settings size={16} className="mb-1" />
                  <span className="block">Settings</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pages" className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Pages</h3>
                  <Button onClick={handleAddPage} size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {isLoadingPages ? (
                  <div className="animate-pulse space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 bg-muted rounded-md"></div>
                    ))}
                  </div>
                ) : pages && pages.length > 0 ? (
                  <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                    {pages.map((page) => (
                      <div
                        key={page.id}
                        className={`p-2 rounded-md cursor-pointer relative group ${
                          selectedPageId === page.id ? "bg-primary/20 border border-primary" : "hover:bg-muted"
                        }`}
                        onClick={() => setSelectedPageId(page.id)}
                      >
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                        <div className="h-16 bg-white border flex items-center justify-center rounded-sm mb-1">
                          <Layout className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-center">Page {page.pageNumber}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground mb-2">No pages yet</p>
                    <Button onClick={handleAddPage} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" /> Add First Page
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="characters" className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Characters</h3>
                  <Button onClick={handleAddCharacter} size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {isLoadingCharacters ? (
                  <div className="animate-pulse space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-muted rounded-md"></div>
                    ))}
                  </div>
                ) : characters && characters.length > 0 ? (
                  <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                    {characters.map((character) => (
                      <div
                        key={character.id}
                        className="p-2 rounded-md hover:bg-muted cursor-pointer flex items-center"
                      >
                        <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center mr-2">
                          {character.imageUrl ? (
                            <img
                              src={character.imageUrl}
                              alt={character.name}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <Users className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{character.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground mb-2">No characters yet</p>
                    <Button onClick={handleAddCharacter} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" /> Add Character
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4">
                <h3 className="font-semibold mb-2">Comic Settings</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Title</p>
                    <p className="text-sm text-muted-foreground">{comic.title}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Format</p>
                    <p className="text-sm text-muted-foreground capitalize">{comic.format}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Art Style</p>
                    <p className="text-sm text-muted-foreground capitalize">{comic.artStyle}</p>
                  </div>
                  {comic.description && (
                    <div>
                      <p className="text-sm font-medium mb-1">Description</p>
                      <p className="text-sm text-muted-foreground">{comic.description}</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Main Editor Canvas */}
          <div className="col-span-8 bg-muted/30 rounded-lg p-4 min-h-[calc(100vh-200px)]">
            {selectedPageId ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="comic-frame bg-white p-4 w-full max-w-xl aspect-[2/3] flex flex-col items-center justify-center">
                  <Pencil className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-center text-muted-foreground">
                    This is the page editor canvas. In a complete implementation,
                    you would be able to add panels, characters, and dialogues here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Select a page from the sidebar or create a new one to start editing
                  </p>
                  <Button onClick={handleAddPage}>
                    <Plus className="h-4 w-4 mr-1" /> Add First Page
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Sidebar */}
          <div className="col-span-2 border-l pl-4">
            <h3 className="font-semibold mb-4">Tools</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Layout className="h-5 w-5 mb-1" />
                <span className="text-xs">Add Panel</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Users className="h-5 w-5 mb-1" />
                <span className="text-xs">Add Character</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Type className="h-5 w-5 mb-1" />
                <span className="text-xs">Add Text</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Image className="h-5 w-5 mb-1" />
                <span className="text-xs">Add Image</span>
              </Button>
            </div>
            
            <div className="mt-8">
              <h3 className="font-semibold mb-4">Properties</h3>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    Select an element on the canvas to edit its properties
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}