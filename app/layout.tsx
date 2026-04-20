import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "repid.dev | AI that earns your trust",
  description: "Train an AI agent, earn rewards, stay anonymous.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-950 text-gray-100 font-sans">
        
        {/* Global Navigation - Phase 6 */}
        <nav className="border-b border-gray-800/50 px-6 py-4 flex items-center justify-between sticky top-0 bg-gray-950/90 backdrop-blur z-50">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-bold text-xl hover:opacity-80 transition-opacity">
              <span className="text-white">RepID</span>
              <span className="text-gray-500">.dev</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/why" className="text-gray-400 hover:text-white transition">Why</Link>
            <Link href="/ecosystem" className="text-gray-400 hover:text-white transition">Ecosystem</Link>
            <Link href="/learn" className="text-gray-400 hover:text-white transition">Learn</Link>
          </div>
          <div className="flex items-center">
            <Link href="/start" className="bg-white text-gray-950 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-200 transition">
              Start
            </Link>
          </div>
        </nav>

        {children}

        {/* Global Footer - Phase 6 */}
        <footer className="border-t border-gray-900 mt-auto px-6 py-8">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-xs font-mono text-gray-500">
            <Link href="/leaderboard" className="hover:text-amber-500 transition">Leaderboard</Link>
            <Link href="/ethics" className="hover:text-amber-500 transition">Ethics</Link>
            <Link href="/bounties" className="hover:text-amber-500 transition">Bounties</Link>
            <span className="hidden sm:inline text-gray-800">|</span>
            <a href="https://trustrepid.dev" className="hover:text-white transition">trustrepid.dev</a>
            <a href="https://trustrails.dev" className="hover:text-white transition">trustrails.dev</a>
            <a href="https://trustshell.dev" className="hover:text-white transition">trustshell.dev</a>
          </div>
        </footer>

      </body>
    </html>
  );
}
