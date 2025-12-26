import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Unlock Gallery - 18+ NSFW Image Generation",
  description: "Earn gems, generate AI images, and unlock them through mini-games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 min-h-screen">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
