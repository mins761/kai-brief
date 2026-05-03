import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kai-brief.example.com';
const googleAnalyticsId = 'G-NRH9JSSD9P';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'KAI Brief',
    template: '%s | KAI Brief'
  },
  description: "Korea's AI & Economy news in English, briefly told.",
  openGraph: {
    title: 'KAI Brief',
    description: "Korea's AI & Economy news in English, briefly told.",
    url: siteUrl,
    siteName: 'KAI Brief',
    images: ['/og-default.png'],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KAI Brief',
    description: "Korea's AI & Economy news in English, briefly told.",
    images: ['/og-default.png']
  },
  alternates: {
    canonical: siteUrl
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}');
          `}
        </Script>
        <Script
          id="adsense-placeholder"
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXX"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
