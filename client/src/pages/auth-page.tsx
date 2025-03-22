import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

const authFormSchema = insertUserSchema.extend({
  confirmPassword: z.string().optional(),
});

const loginSchema = authFormSchema.pick({
  username: true,
  password: true,
});

const registerSchema = authFormSchema
  .extend({
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [_, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...userData } = data;
    registerMutation.mutate(userData);
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-0 w-64 h-64 bg-primary opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#8C52FF] opacity-10 rounded-full blur-3xl"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side: Auth forms */}
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-['Bangers'] text-primary">
                Welcome to <span className="text-[#8C52FF]">ComicCraft</span>
              </CardTitle>
              <CardDescription>
                Sign in to your account or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue={isLoggingIn ? "login" : "register"}
                onValueChange={(value) => setIsLoggingIn(value === "login")}
              >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                {/* Login Form */}
                <TabsContent value="login">
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-username">Username</Label>
                        <Input
                          id="login-username"
                          placeholder="Enter your username"
                          {...loginForm.register("username")}
                        />
                        {loginForm.formState.errors.username && (
                          <p className="text-sm text-red-500">
                            {loginForm.formState.errors.username.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="Enter your password"
                          {...loginForm.register("password")}
                        />
                        {loginForm.formState.errors.password && (
                          <p className="text-sm text-red-500">
                            {loginForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-[#8C52FF] hover:bg-[#8C52FF]/90"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Sign In
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                {/* Register Form */}
                <TabsContent value="register">
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-username">Username</Label>
                        <Input
                          id="register-username"
                          placeholder="Choose a username"
                          {...registerForm.register("username")}
                        />
                        {registerForm.formState.errors.username && (
                          <p className="text-sm text-red-500">
                            {registerForm.formState.errors.username.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Password</Label>
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="Create a password"
                          {...registerForm.register("password")}
                        />
                        {registerForm.formState.errors.password && (
                          <p className="text-sm text-red-500">
                            {registerForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-confirm-password">
                          Confirm Password
                        </Label>
                        <Input
                          id="register-confirm-password"
                          type="password"
                          placeholder="Confirm your password"
                          {...registerForm.register("confirmPassword")}
                        />
                        {registerForm.formState.errors.confirmPassword && (
                          <p className="text-sm text-red-500">
                            {registerForm.formState.errors.confirmPassword.message}
                          </p>
                        )}
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Create Account
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 border-t pt-4">
              <div className="text-center w-full text-sm text-gray-500">
                {isLoggingIn
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  onClick={() => setIsLoggingIn(!isLoggingIn)}
                  className="text-[#8C52FF] hover:underline"
                >
                  {isLoggingIn ? "Register" : "Login"}
                </button>
              </div>
            </CardFooter>
          </Card>

          {/* Right side: Info section */}
          <div className="hidden lg:flex flex-col justify-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-['Bangers'] text-[#2D0E49]">
                Unleash Your <span className="text-primary">Creative</span>{" "}
                Storytelling <span className="text-[#8C52FF]">Powers!</span>
              </h1>
              <p className="text-lg text-gray-600 font-['Nunito']">
                Join ComicCraft today and transform your ideas into amazing comic strips in minutes - no artistic skills required!
              </p>
              <div className="space-y-4">
                {[
                  "Access thousands of characters, backgrounds, and props",
                  "Create unlimited comics with our easy drag-and-drop editor",
                  "Share your creations with friends or the community",
                  "Download your comics in multiple formats",
                ].map((feature, i) => (
                  <div key={i} className="flex items-start">
                    <div className="h-5 w-5 text-primary mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="ml-2 text-gray-600">{feature}</p>
                  </div>
                ))}
              </div>
              <div className="border border-[#8C52FF]/20 rounded-lg p-4 bg-[#8C52FF]/5">
                <p className="text-[#2D0E49] italic">
                  "ComicCraft helped me bring my story ideas to life without having to learn complex drawing skills. It's incredibly intuitive and fun!"
                </p>
                <p className="text-right mt-2 text-gray-600 font-semibold">
                  - ComicCraft User
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
