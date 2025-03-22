import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, ImagePlus, BookOpen } from "lucide-react";

const NavBar = () => {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-3xl font-['Bangers'] text-primary">
                Comic<span className="text-[#8C52FF]">Craft</span>
              </span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/">
                <a className={`border-transparent ${location === "/" ? "border-[#8C52FF] text-dark" : "text-gray-500"} hover:text-[#8C52FF] font-['Quicksand'] font-medium border-b-2 px-1 pt-1 text-sm`}>
                  Home
                </a>
              </Link>
              {user && (
                <>
                  <Link href="/my-comics">
                    <a className={`border-transparent ${location === "/my-comics" ? "border-[#8C52FF] text-dark" : "text-gray-500"} hover:text-[#8C52FF] font-['Quicksand'] font-medium border-b-2 px-1 pt-1 text-sm`}>
                      My Comics
                    </a>
                  </Link>
                  <Link href="/editor">
                    <a className={`border-transparent ${location === "/editor" ? "border-[#8C52FF] text-dark" : "text-gray-500"} hover:text-[#8C52FF] font-['Quicksand'] font-medium border-b-2 px-1 pt-1 text-sm`}>
                      Create New
                    </a>
                  </Link>
                </>
              )}
              <a href="#" className="border-transparent text-gray-500 hover:text-[#8C52FF] font-['Quicksand'] font-medium border-b-2 px-1 pt-1 text-sm">
                Templates
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-[#8C52FF] text-white">
                        {user.username.substring(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.username}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/my-comics">
                      <a className="flex items-center w-full cursor-pointer">
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>My Comics</span>
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/editor">
                      <a className="flex items-center w-full cursor-pointer">
                        <ImagePlus className="mr-2 h-4 w-4" />
                        <span>Create New</span>
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => logoutMutation.mutate()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="outline" className="hidden md:inline-flex items-center text-[#8C52FF]">
                    Log In
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button className="bg-[#8C52FF] hover:bg-[#8C52FF]/90 shadow-md hover:shadow-lg transition-all duration-150 hover:-translate-y-0.5">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
