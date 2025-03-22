import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import HomePage from "@/pages/home-page";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import ComicEditor from "@/pages/comic-editor";
import ComicsList from "@/pages/comics-list";
import { ProtectedRoute } from "./lib/protected-route";
import NavBar from "./components/NavBar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/editor" component={ComicEditor} />
      <ProtectedRoute path="/editor/:id" component={ComicEditor} />
      <ProtectedRoute path="/my-comics" component={ComicsList} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="font-body bg-background text-foreground min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        <Router />
      </main>
      <Toaster />
    </div>
  );
}

export default App;
