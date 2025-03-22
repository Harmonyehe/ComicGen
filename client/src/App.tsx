import React from "react";
import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

// Pages
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ComicListPage } from "@/pages/ComicListPage";
import { CreateComicPage } from "@/pages/CreateComicPage";
import { ComicEditorPage } from "@/pages/ComicEditorPage";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/comics" component={ComicListPage} />
        <Route path="/create" component={CreateComicPage} />
        <Route path="/edit/:id" component={ComicEditorPage} />
        <Route>
          {/* 404 Page */}
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4">404</h1>
              <p className="text-lg text-muted-foreground mb-6">Page not found</p>
              <a href="/" className="text-primary hover:underline">
                Go back home
              </a>
            </div>
          </div>
        </Route>
      </Switch>
    </QueryClientProvider>
  );
}