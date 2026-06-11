import type { Metadata } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import "./globals.css";

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
  title: "Antoinette Fernandas — Creative Director in Emerging Tech",
  description: "Stockholm creative and tech hybrid. Work spans AI, fashion, emerging technology, and design practice.",
  authors: [{ name: "Antoinette Fernandas" }],
  openGraph: {
    type: "website",
    title: "Antoinette Fernandas — Creative Director in Emerging Tech",
    description: "Stockholm creative and tech hybrid. Work spans AI, fashion, emerging technology, and design practice.",
    siteName: "Antoinette Fernandas Portfolio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${outfit.variable}`}>
      <body>{children}</body>
    </html>
  );
}
