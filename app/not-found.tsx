import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GraduationCap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex w-16 h-16 bg-primary-50 rounded-2xl items-center justify-center mb-6">
          <GraduationCap className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Page not found</h2>
        <p className="text-gray-500 text-sm mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/">
            <Button>Go home</Button>
          </Link>
          <Link href="/colleges">
            <Button variant="outline">Browse colleges</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
