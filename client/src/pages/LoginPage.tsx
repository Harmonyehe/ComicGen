import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Login form schema with validations
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [, navigate] = useLocation();
  
  // Check URL for registration success message
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("registered") === "true") {
      setRegistrationSuccess(true);
    }
  }, []);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const loginMutation = useMutation({
    mutationFn: (values: LoginFormValues) => {
      return apiRequest("/api/users/login", {
        method: "POST",
        body: JSON.stringify(values),
      });
    },
    onSuccess: () => {
      // Invalidate user queries to refetch user data
      queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
      navigate("/comics");
    },
    onError: (error: any) => {
      setErrorMessage(error.message || "Invalid email or password. Please try again.");
    },
  });
  
  const onSubmit = (values: LoginFormValues) => {
    setErrorMessage(null);
    loginMutation.mutate(values);
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          {registrationSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 mb-6 flex items-start">
              <CheckCircle2 className="h-5 w-5 mr-3 mt-0.5 text-green-500" />
              <div>
                <h3 className="font-medium">Registration successful!</h3>
                <p className="text-sm">Your account has been created. Please log in with your credentials.</p>
              </div>
            </div>
          )}
          
          <div className="comic-panel bg-white p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
              <p className="text-muted-foreground">Log in to continue creating comics</p>
            </div>
            
            {errorMessage && (
              <div className="bg-destructive/20 text-destructive p-3 rounded-md mb-4 border border-destructive flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {errorMessage}
              </div>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter your password" 
                            {...field} 
                          />
                          <button 
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full mt-4 action-btn" 
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Logging in..." : "Log In"}
                  </Button>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <a 
                      href="/register" 
                      className="text-primary font-medium hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/register");
                      }}
                    >
                      Sign up
                    </a>
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}