import type { Metadata } from "next";

import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import StructuredData from "./components/StructuredData";
import CookieConsent from "./components/CookieConsent";

import localFont from 'next/font/local';

export const myLocalFont = localFont({
  
  src: '/ppeditorialold-ultralightitalic.woff2',
  variable: '--font-local',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Adorned by Sophia | Luxury Fashion & Accessories",
    template: "%s | Adorned by Sophia"
  },
  description: "Discover exquisite RTW Boubous, elegant Palazzos, and luxury fashion pieces. Adorned by Sophia offers a seamless shopping experience for your favorite statement pieces.",
  keywords: ["fashion", "boubous", "palazzos", "luxury fashion", "RTW", "designer clothing", "Adorned by Sophia", "elegant wear", "statement pieces","african fashion","african wear"],
  authors: [{ name: "Adorned by Sophia" }],
  creator: "Adorned by Sophia",
  publisher: "Adorned by Sophia",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://adornedbysophia.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Adorned by Sophia | Luxury Fashion & Accessories",
    description: "Discover exquisite RTW Boubous, elegant Palazzos, and luxury fashion pieces. Your favorite pieces, a seamless new way to shop.",
    url: '/',
    siteName: "Adorned by Sophia",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Adorned by Sophia - Luxury Fashion',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Adorned by Sophia | Luxury Fashion & Accessories",
    description: "Discover exquisite RTW Boubous, elegant Palazzos, and luxury fashion pieces.",
    images: ['/og-image.jpg'],
    creator: '@adornedbysophiaa',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
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
        <StructuredData />
        <Analytics/>
        <CookieConsent />
        {children}
      </body>
    </html>
  );
}
