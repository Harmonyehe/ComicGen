import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { BookOpen, LogIn, LogOut, User, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";

type User = {
  id: string;
  username: string;
  email: string;
};

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, navigate] = useLocation();
  
  // Close menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  // Fetch current user
  const userQuery = useQuery({
    queryKey: ["/api/users/me"],
    queryFn: () => apiRequest("/api/users/me"),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retryOnMount: false, // Don't retry when the component mounts
  });
  
  const isAuthenticated = !!userQuery.data;
  const user = userQuery.data as User | undefined;
  
  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => {
      return apiRequest("/api/users/logout", {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
      navigate("/");
    },
  });
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const navItems = [
    ...(isAuthenticated 
      ? [
          { label: "My Comics", href: "/comics" },
          { label: "Create New", href: "/create" },
        ] 
      : []
    ),
  ];
  
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a 
            href="/" 
            className="flex items-center space-x-2"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold comic-subtitle">Comic Creator</span>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  location === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.href);
                }}
              >
                {item.label}
              </a>
            ))}
            
            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium">
                  <span className="text-muted-foreground mr-2">Hi,</span>
                  {user?.username}
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/login")}
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate("/register")}
                >
                  <User className="h-4 w-4 mr-1" />
                  Register
                </Button>
              </div>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-600"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-3 space-y-2">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`block px-3 py-2 rounded-md ${
                  location === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.href);
                }}
              >
                {item.label}
              </a>
            ))}
            
            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="space-y-2 border-t pt-2 mt-2">
                <div className="px-3 py-2 text-sm font-medium">
                  <span className="text-muted-foreground mr-1">Logged in as</span>
                  {user?.username}
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 border-t pt-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="justify-center"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate("/register")}
                  className="justify-center"
                >
                  <User className="h-4 w-4 mr-1" />
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};