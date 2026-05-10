import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/providers/LenisProvider";
import ScrollProgressBar from "@/components/global/ScrollProgressBar";
import MagneticCursor from "@/components/global/MagneticCursor";
import BackButton from "@/components/global/BackButton";
import HomeButton from "@/components/global/HomeButton";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gauttham R — Code, with a director's cut.",
  description:
    "A cinematic engineering portfolio. Code, with a director's cut.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-paper">
        <LenisProvider>
          <ScrollProgressBar />
          <MagneticCursor />
          <BackButton />
          <HomeButton />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
