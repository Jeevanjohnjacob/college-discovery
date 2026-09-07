import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function CollegeNotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">🎓</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">College not found</h1>
        <p className="text-gray-500 text-sm mb-8">
          This college doesn&apos;t exist in our database yet.
        </p>
        <Link href="/colleges">
          <Button>Browse all colleges</Button>
        </Link>
      </div>
    </div>
  );
}
