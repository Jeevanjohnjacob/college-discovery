import Link from "next/link";
import { GraduationCap } from "lucide-react";

const footerLinks = {
  Explore: [
    { label: "All Colleges", href: "/colleges" },
    { label: "Engineering", href: "/colleges?type=ENGINEERING" },
    { label: "Management", href: "/colleges?type=MANAGEMENT" },
    { label: "Medical", href: "/colleges?type=MEDICAL" },
    { label: "Law", href: "/colleges?type=LAW" },
  ],
  Tools: [
    { label: "Compare Colleges", href: "/compare" },
    { label: "Saved Colleges", href: "/saved" },
  ],
  Account: [
    { label: "Sign In", href: "/auth/login" },
    { label: "Create Account", href: "/auth/register" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-white text-lg">
                College<span className="text-primary-400">Discovery</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Your one-stop platform to discover, compare, and shortlist the best colleges in India.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-semibold text-white mb-3">{heading}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs">
            © {new Date().getFullYear()} CollegeDiscovery. Built with Next.js, Prisma & TailwindCSS.
          </p>
          <p className="text-xs">
            Data for reference only. Verify with official college websites.
          </p>
        </div>
      </div>
    </footer>
  );
}
