import { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your CollegeDiscovery account.",
};

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gray-50">
      <Suspense fallback={
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 animate-pulse">
            <div className="h-12 w-12 bg-gray-200 rounded-xl mx-auto mb-4" />
            <div className="h-6 bg-gray-200 rounded mx-auto w-40 mb-2" />
            <div className="h-4 bg-gray-100 rounded mx-auto w-32 mb-8" />
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded-lg" />
              <div className="h-10 bg-gray-200 rounded-lg" />
              <div className="h-10 bg-primary-200 rounded-lg" />
            </div>
          </div>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
