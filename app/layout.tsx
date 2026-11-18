import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'

const _geist = Geist({ subsets: ["latin"], display: 'swap' });
const _geistMono = Geist_Mono({ subsets: ["latin"], display: 'swap', preload: false });
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-2PRERNRHTS";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://grabdeal.net').replace(/\/$/, '')
const API_ORIGIN = (() => { try { return new URL(process.env.NEXT_PUBLIC_API_URL || 'https://grabdeal-server.vercel.app/api/v1').origin } catch { return 'https://grabdeal-server.vercel.app' } })()
const SITE_DESC = 'Find the best deals, coupons and offers from top brands. Save money with GrabDeal.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'GrabDeal - Best Deals, Coupons & Offers',
    template: '%s | GrabDeal',
  },
  description: SITE_DESC,
  applicationName: 'GrabDeal',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'GrabDeal',
    url: SITE_URL,
    title: 'GrabDeal - Best Deals, Coupons & Offers',
    description: SITE_DESC,
    images: [{ url: '/logo.png', alt: 'GrabDeal' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GrabDeal - Best Deals, Coupons & Offers',
    description: SITE_DESC,
    images: ['/logo.png'],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GrabDeal',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GrabDeal',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/offer?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
        <link rel="preconnect" href={API_ORIGIN} crossOrigin="" />
      </head>
      <body className="font-sans antialiased bg-background">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        {children}
        {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
      </body>
    </html>
  )
}
