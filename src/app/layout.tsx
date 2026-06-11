import type { Metadata } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import "./globals.css";
import NoiseOverlay from "../components/NoiseOverlay";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Antoinette Fernandes — Creative Director in Emerging Tech",
  description: "Stockholm creative and tech hybrid. Work spans AI, fashion, emerging technology, and design practice.",
  authors: [{ name: "Antoinette Fernandes" }],
  openGraph: {
    type: "website",
    title: "Antoinette Fernandes — Creative Director in Emerging Tech",
    description: "Stockholm creative and tech hybrid. Work spans AI, fashion, emerging technology, and design practice.",
    siteName: "Antoinette Fernandes Portfolio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${outfit.variable}`}>
      <body>
        <NoiseOverlay />
        {children}
      </body>
    </html>
  );
}
