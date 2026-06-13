import type { Metadata } from "next";
import localFont from "next/font/local";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";

// Display face — the geometric Bauhaus-style type the user pinned.
const bayer = localFont({
  src: "./fonts/BayerUniversal-Regular.ttf",
  variable: "--font-bayer",
  display: "swap",
});

// Readable body companion — a clean geometric grotesque that sits well
// alongside the experimental display face without fighting it.
const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Danylo Kalynovskyi — React Developer",
  description:
    "Portfolio of Danylo Kalynovskyi — media design student specializing in front-end web development and UI/UX design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bayer.variable} ${hanken.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
