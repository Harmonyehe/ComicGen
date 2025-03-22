import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Plus, Edit, Trash2, MoreHorizontal, BookOpen } from "lucide-react";

import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Comic } from "@shared/schema";

export function ComicListPage() {
  const [, navigate] = useLocation();
  
  // Fetch user's comics
  const { data: comics, isLoading, error } = useQuery<Comic[]>({
    queryKey: ["/api/comics"],
  });
  
  const handleCreateNew = () => {
    navigate("/create");
  };
  
  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Comics</h1>
          <Button className="action-btn" onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" /> Create New Comic
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-md"></div>
            ))}
          </div>
        ) : error ? (
          <Card className="bg-destructive/10 border-destructive p-6 text-center">
            <h3 className="font-medium text-lg mb-2">Error Loading Comics</h3>
            <p className="text-muted-foreground mb-4">
              We encountered an error while loading your comics. Please try again later.
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </Card>
        ) : comics && comics.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {comics.map((comic) => (
              <Card key={comic.id} className="overflow-hidden comic-panel bg-white group cursor-pointer hover:shadow-lg transition-shadow">
                <div 
                  className="aspect-[3/4] bg-muted relative" 
                  onClick={() => handleEdit(comic.id)}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="comic-frame h-4/5 w-4/5 flex items-center justify-center bg-gray-100">
                      <BookOpen className="h-12 w-12 text-gray-400" />
                    </div>
                  </div>
                  
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(comic.id);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg truncate">{comic.title}</h3>
                      <p className="text-xs text-muted-foreground mb-1 capitalize">
                        {comic.format} · {comic.artStyle}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(comic.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="dropdown-wrapper relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-8 w-8 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Would implement dropdown menu here in a complete app
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted/40 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-medium mb-3">No comics yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              You haven't created any comics yet. Start creating your first comic masterpiece now!
            </p>
            <Button className="action-btn" onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" /> Create Your First Comic
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}