import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { assetPath, assetUrl, siteUrl } from "../lib/site";
const editorialFont = localFont({
  src: [
    {
      path: "../assets/fonts/eb-garamond-medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-editorial",
});
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: siteUrl },
  title: "Artsiom Makarevich — Fullstack Developer",
  description:
    "React, TypeScript and Next.js developer. Explore creative web experiences, thoughtful interfaces and reliable product engineering through an interactive click-wheel portfolio.",
  openGraph: {
    title: "Artsiom Makarevich — Fullstack Developer",
    description:
      "A digital portfolio. An analog feeling. React, TypeScript and Next.js.",
    type: "website",
    locale: "en_US",
    url: siteUrl,
    images: [
      {
        url: assetUrl("/og.jpg"),
        width: 1200,
        height: 630,
        alt: "Artsiom Makarevich — a click-wheel fullstack portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Artsiom Makarevich — Fullstack Developer",
  },
  robots: { index: true, follow: true },
  icons: { icon: assetPath("/icon.svg") },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#eae7de",
};
const startupScript = `try{if(localStorage.getItem('am:intro:v1')!=='seen'&&localStorage.getItem('am:intro')!=='seen'&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.setAttribute('data-am-start','pending')}catch{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.setAttribute('data-am-start','pending')}setTimeout(()=>document.documentElement.removeAttribute('data-am-start'),2500)`;
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: startupScript }} />
      </head>
      <body className={editorialFont.variable}>{children}</body>
    </html>
  );
}
