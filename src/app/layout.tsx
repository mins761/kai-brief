import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kai-brief.vercel.app';
const googleAnalyticsId = 'G-9ZBVWR7FZ7';

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
  },
  other: {
    'google-adsense-account': 'ca-pub-2432965833930637'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2432965833930637"
          crossOrigin="anonymous"
        />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
        />
        <script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}');
          `}
        </script>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
