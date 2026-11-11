import type { Metadata } from "next";
import { Hanken_Grotesk, Josefin_Sans } from "next/font/google";
import TransitionProvider from "@/components/transition/TransitionProvider";
import "./globals.css";

// Display face — geometric, vintage Bauhaus feel. Variable font, so every
// weight (100–700) is available without extra downloads.
const josefin = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000")
  ),
  title: {
    default: "Danylo Kalynovskyi",
    template: "%s · Danylo Kalynovskyi",
  },
  description:
    "Portfolio of Danylo Kalynovskyi",
  openGraph: {
    title: "Danylo Kalynovskyi",
    description:
      "Portfolio of Danylo Kalynovskyi",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "Danylo Kalynovskyi portfolio" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Danylo Kalynovskyi",
    description:
      "Portfolio of Danylo Kalynovskyi",
    images: ["/og.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${josefin.variable} ${hanken.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <TransitionProvider>{children}</TransitionProvider>
      </body>
    </html>
  );
}
