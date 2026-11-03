import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono, Space_Grotesk, Playfair_Display, Bebas_Neue, DM_Serif_Display, Archivo_Black, Sora, Oswald, Caveat, IBM_Plex_Mono, Syne, Manrope, Lora } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/providers/LenisProvider";
import ScrollProgressBar from "@/components/global/ScrollProgressBar";
import MagneticCursor from "@/components/global/MagneticCursor";
import BackButton from "@/components/global/BackButton";
import HomeButton from "@/components/global/HomeButton";
import BackgroundMusic from "@/components/audio/BackgroundMusic";

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

const spaceGrotesk = Space_Grotesk({ variable: '--font-space', subsets: ['latin'], display: 'swap', preload: false });
const playfair = Playfair_Display({ variable: '--font-playfair', subsets: ['latin'], display: 'swap', preload: false });
const bebas = Bebas_Neue({ variable: '--font-bebas', weight: '400', subsets: ['latin'], display: 'swap', preload: false });
const dmSerif = DM_Serif_Display({ variable: '--font-dmserif', weight: '400', subsets: ['latin'], display: 'swap', preload: false });
const archivoBlack = Archivo_Black({ variable: '--font-archivo', weight: '400', subsets: ['latin'], display: 'swap', preload: false });
const sora = Sora({ variable: '--font-sora', subsets: ['latin'], display: 'swap', preload: false });
const oswald = Oswald({ variable: '--font-oswald', subsets: ['latin'], display: 'swap', preload: false });
const caveat = Caveat({ variable: '--font-caveat', subsets: ['latin'], display: 'swap', preload: false });
const plexMono = IBM_Plex_Mono({ variable: '--font-plex', weight: ['400', '500', '600'], subsets: ['latin'], display: 'swap', preload: false });
const syne = Syne({ variable: '--font-syne', subsets: ['latin'], display: 'swap', preload: false });
const manrope = Manrope({ variable: '--font-manrope', subsets: ['latin'], display: 'swap', preload: false });
const lora = Lora({ variable: '--font-lora', subsets: ['latin'], display: 'swap', preload: false });
const extraFonts = [spaceGrotesk, playfair, bebas, dmSerif, archivoBlack, sora, oswald, caveat, plexMono, syne, manrope, lora].map((f) => f.variable).join(' ');

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
      className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable} ${extraFonts} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-paper">
        <LenisProvider>
          <ScrollProgressBar />
          <MagneticCursor />
          <BackButton />
          <HomeButton />
          <BackgroundMusic />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
