import type { Metadata } from "next";

import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

import localFont from 'next/font/local';

export const myLocalFont = localFont({
  
  src: '/ppeditorialold-ultralightitalic.woff2',
  variable: '--font-local',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Adorned by Sophia",
  description: "Adorned by Sophia | RTW Boubous | Palazzos & More",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${myLocalFont.variable} antialiased`}
      >
        <Analytics/>
        {children}
      </body>
    </html>
  );
}
