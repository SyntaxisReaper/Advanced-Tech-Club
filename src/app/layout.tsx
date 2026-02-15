import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Changing font to Inter as per design guidelines
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackgroundNetwork } from "@/components/ui/background-network";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Advanced Tech Club",
  description: "Platform for the Advanced Tech Club - Events, Competitions, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} text-foreground bg-transparent antialiased min-h-screen flex flex-col relative overflow-x-hidden`}>
        <BackgroundNetwork />
        <Navbar />
        <main className="flex-grow pt-16 relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
