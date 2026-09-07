import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "CollegeDiscovery — Find Your Perfect College",
    template: "%s | CollegeDiscovery",
  },
  description:
    "Discover, compare, and shortlist the best colleges in India. Search by location, fees, ratings, and more.",
  keywords: ["college", "university", "admission", "India", "engineering", "MBA", "medical"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
