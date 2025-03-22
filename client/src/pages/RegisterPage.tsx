import { MainLayout } from "@/components/layout/MainLayout";
import { RegisterForm } from "@/components/forms/RegisterForm";

export function RegisterPage() {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <div className="comic-panel bg-white p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2">Join Comic Creator</h1>
              <p className="text-muted-foreground">Create your account to get started</p>
            </div>
            
            <RegisterForm />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}