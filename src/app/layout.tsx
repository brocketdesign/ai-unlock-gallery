import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Unlock Gallery - Generate & Unlock NSFW AI Images",
  description: "Generate stunning AI images and unlock them through interactive mini-games. Earn gems and build your unique collection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="theme-color" content="#0f172a" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
        </head>
        <body className="antialiased">
          <div className="relative min-h-screen">
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-10 animate-pulse" />
              <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-pink-600 rounded-full blur-3xl opacity-10 animate-pulse" />
              <div className="absolute top-1/2 right-0 w-72 h-72 bg-indigo-600 rounded-full blur-3xl opacity-10 animate-pulse" />
            </div>

            {/* Main content */}
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
