import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ScrollProvider } from "@/lib/motion/scroll-provider";
import { LazySceneCanvas } from "@/components/experience/lazy-scene-canvas";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIBARI",
  description: "SIBARI",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <LazySceneCanvas />
        <ScrollProvider>{children}</ScrollProvider>
      </body>
    </html>
  );
}
