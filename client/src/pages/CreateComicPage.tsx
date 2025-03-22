import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, useRoute } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Create comic schema with validations
const createComicSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  format: z.enum(["webtoon", "manga", "instagram", "classic"]),
  artStyle: z.string().min(1, "Art style is required"),
});

type CreateComicFormValues = z.infer<typeof createComicSchema>;

export function CreateComicPage() {
  const [, params] = useRoute("/create");
  const [, navigate] = useLocation();
  const queryParams = new URLSearchParams(window.location.search);
  const titleFromUrl = queryParams.get("title") || "";
  
  const form = useForm<CreateComicFormValues>({
    resolver: zodResolver(createComicSchema),
    defaultValues: {
      title: titleFromUrl,
      description: "",
      format: "webtoon",
      artStyle: "cartoon",
    },
  });
  
  const formatOptions = [
    { value: "webtoon", label: "Webtoon", description: "Vertical scrolling format popular on mobile devices." },
    { value: "manga", label: "Manga", description: "Right-to-left reading format in Japanese style." },
    { value: "instagram", label: "Instagram", description: "Square format optimized for social media sharing." },
    { value: "classic", label: "Classic", description: "Traditional comic book layout with panels." },
  ];
  
  const artStyleOptions = [
    { value: "cartoon", label: "Cartoon", description: "Colorful and expressive style with exaggerated features." },
    { value: "realistic", label: "Realistic", description: "Detailed and lifelike style with natural proportions." },
    { value: "manga", label: "Manga", description: "Japanese animation style with distinctive character designs." },
    { value: "sketch", label: "Sketch", description: "Hand-drawn appearance with visible linework." },
    { value: "pixel", label: "Pixel Art", description: "Retro style with visible square pixels." },
  ];
  
  const createComicMutation = useMutation({
    mutationFn: (values: CreateComicFormValues) => {
      return apiRequest("/api/comics", {
        method: "POST",
        body: JSON.stringify(values),
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/comics"] });
      navigate(`/edit/${data.id}`);
    },
  });
  
  const onSubmit = (values: CreateComicFormValues) => {
    createComicMutation.mutate(values);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <Button variant="outline" onClick={() => navigate("/comics")} className="mb-6">
          <ArrowLeft size={16} className="mr-2" /> Back to Comics
        </Button>
        
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Create a New Comic</h1>
          
          <div className="comic-panel bg-white p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Basic Information</h2>
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comic Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter a title for your comic" {...field} className="comic-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Briefly describe what your comic is about" 
                            {...field} 
                            className="comic-input"
                            value={field.value || ""} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Format Selection */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Comic Format</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose the format that best suits your storytelling style.
                  </p>
                  
                  <FormField
                    control={form.control}
                    name="format"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Tabs 
                            value={field.value} 
                            onValueChange={field.onChange}
                            className="w-full"
                          >
                            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
                              {formatOptions.map(format => (
                                <TabsTrigger 
                                  key={format.value} 
                                  value={format.value}
                                  className="text-center"
                                >
                                  {format.label}
                                </TabsTrigger>
                              ))}
                            </TabsList>
                            
                            {formatOptions.map(format => (
                              <TabsContent key={format.value} value={format.value} className="mt-4">
                                <Card>
                                  <CardContent className="p-4">
                                    <p className="text-sm text-muted-foreground">{format.description}</p>
                                  </CardContent>
                                </Card>
                              </TabsContent>
                            ))}
                          </Tabs>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Art Style Selection */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Art Style</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select the visual style for your comic.
                  </p>
                  
                  <FormField
                    control={form.control}
                    name="artStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {artStyleOptions.map(style => (
                              <div 
                                key={style.value} 
                                onClick={() => field.onChange(style.value)}
                                className={`
                                  cursor-pointer p-4 rounded-md text-center transition-all
                                  ${field.value === style.value 
                                    ? 'bg-primary/20 border-2 border-primary' 
                                    : 'bg-muted/40 border-2 border-transparent hover:bg-muted/60'
                                  }
                                `}
                              >
                                <div className="font-medium mb-1">{style.label}</div>
                                <div className="text-xs text-muted-foreground">
                                  {style.description}
                                </div>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="pt-6 border-t">
                  <Button 
                    type="submit" 
                    className="w-full action-btn" 
                    disabled={createComicMutation.isPending}
                  >
                    {createComicMutation.isPending ? "Creating Comic..." : "Create Comic"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}