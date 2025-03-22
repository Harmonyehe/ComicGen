import React from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  Pencil,
  Trash2,
  Download,
  Loader2,
  BookOpen
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ComicsList() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [comicToDelete, setComicToDelete] = React.useState<number | null>(null);

  // Fetch user's comics
  const { data: comics, isLoading } = useQuery({
    queryKey: ["/api/comics"],
  });

  // Delete comic mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/comics/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/comics"] });
      toast({
        title: "Comic deleted",
        description: "Your comic has been deleted successfully.",
      });
      setComicToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error deleting comic",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    if (comicToDelete !== null) {
      deleteMutation.mutate(comicToDelete);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-['Bangers'] text-[#2D0E49]">
              My <span className="text-primary">Comics</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your saved comic creations
            </p>
          </div>
          <Button
            onClick={() => navigate("/editor")}
            className="bg-[#8C52FF] hover:bg-[#8C52FF]/90"
          >
            <Plus className="h-4 w-4 mr-2" /> Create New Comic
          </Button>
        </div>

        {/* Decorative element */}
        <div className="absolute -z-10 top-20 left-0 w-64 h-64 bg-primary opacity-5 rounded-full blur-3xl"></div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !comics || comics.length === 0 ? (
          <Card>
            <CardContent className="py-10">
              <div className="text-center space-y-6">
                <BookOpen className="h-16 w-16 text-[#8C52FF]/30 mx-auto" />
                <div>
                  <h3 className="text-xl font-bold text-[#2D0E49] mb-2">
                    No Comics Found
                  </h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    You haven't created any comics yet. Start creating your first comic strip now!
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/editor")}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4 mr-2" /> Create First Comic
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Comic cards would be mapped here */}
            {[1, 2, 3].map((id) => (
              <Card key={id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-primary/20 via-[#8C52FF]/20 to-[#FF7AC6]/20 flex items-center justify-center">
                  <span className="font-['Bangers'] text-3xl text-[#2D0E49]">
                    Sample Comic {id}
                  </span>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle>Sample Comic {id}</CardTitle>
                  <CardDescription>Created on {new Date().toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/editor/${id}`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setComicToDelete(id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            comic.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setComicToDelete(null)}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            {deleteMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Delete"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-primary border-primary"
                  >
                    <Download className="h-4 w-4 mr-2" /> Export
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
