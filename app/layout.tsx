import type { Metadata } from "next";
import { Newsreader, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Atlas Literario",
  description:
    "Explora los libros clásicos a través de mapas, personajes y emociones.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${newsreader.variable} ${dmSans.variable}`}>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}