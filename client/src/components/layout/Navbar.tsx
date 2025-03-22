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
    <header className="sticky top-0 z-50 border-b-3 border-comic-dark bg-white">
      <div className="absolute top-0 left-0 w-full h-1 bg-comic-yellow"></div>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a 
            href="/" 
            className="flex items-center space-x-2 group"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            <div className="relative">
              <BookOpen className="h-7 w-7 text-comic-red" />
              <div className="absolute -top-8 -right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="sound-effect bg-comic-yellow text-sm">
                  ZOOM!
                </div>
              </div>
            </div>
            <span className="text-2xl font-bold comic-subtitle text-comic-red transform -rotate-1">COMITALE</span>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`px-3 py-2 text-base font-medium comic-subtitle rounded-md transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} ${
                  location === item.href
                    ? "bg-comic-blue text-white"
                    : "hover:bg-comic-blue/10 hover:text-comic-blue"
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
                <div className="dialogue-bubble py-1 px-3 my-0 text-sm font-medium">
                  <span className="mr-1">Hi,</span>
                  <span className="font-bold comic-subtitle">{user?.username}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-2 border-comic-dark text-comic-dark hover:bg-comic-dark/5 action-btn"
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </Button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="border-2 border-comic-blue text-comic-blue hover:bg-comic-blue/10 action-btn"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate("/register")}
                  className="bg-comic-red hover:bg-comic-red/90 border-2 border-comic-dark action-btn"
                >
                  <User className="h-4 w-4 mr-1" />
                  Register
                </Button>
              </div>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-comic-dark border-2 border-comic-dark rounded-md p-1"
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
        <div className="md:hidden bg-white border-t border-comic-dark">
          <div className="container mx-auto px-4 py-3 space-y-2">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`block px-3 py-2 rounded-md comic-subtitle ${
                  location === item.href
                    ? "bg-comic-blue text-white"
                    : "text-comic-dark hover:bg-comic-blue/10"
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
              <div className="space-y-2 border-t border-dashed border-comic-dark/30 pt-2 mt-2">
                <div className="px-3 py-2 text-sm font-medium dialogue-bubble my-0">
                  <span className="mr-1">Logged in as</span>
                  <span className="font-bold comic-subtitle">{user?.username}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="w-full justify-center border-2 border-comic-dark text-comic-dark hover:bg-comic-dark/5 action-btn"
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 border-t border-dashed border-comic-dark/30 pt-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="justify-center border-2 border-comic-blue text-comic-blue hover:bg-comic-blue/10 action-btn"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate("/register")}
                  className="justify-center bg-comic-red hover:bg-comic-red/90 border-2 border-comic-dark action-btn"
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