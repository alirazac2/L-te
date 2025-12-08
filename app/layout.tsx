import './globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import Web3ModalProvider from '@/components/Web3ModalProvider'

const poppins = Poppins({ weight: ['300', '400', '500', '600', '700'], subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ZK3 Bio - Link in Bio Tool',
  description: 'Create your professional link in bio page. Share all your important links in one place with ZK3 Bio - the best alternative to Linktree.',
  keywords: 'link in bio, linktree alternative, bio link, social media links, profile links, zk3 bio',
  authors: [{ name: 'ZK3 Bio' }],
  creator: 'ZK3 Bio',
  publisher: 'ZK3 Bio',
  metadataBase: new URL('https://bio.zk3.xyz'),
  alternates: {
    canonical: 'https://bio.zk3.xyz',
  },
  openGraph: {
    title: 'ZK3 Bio - Link in Bio Tool',
    description: 'Create your professional link in bio page. Share all your important links in one place.',
    url: 'https://bio.zk3.xyz',
    siteName: 'ZK3 Bio',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZK3 Bio - Link in Bio Tool',
    description: 'Create your professional link in bio page. Share all your important links in one place.',
    creator: '@zk3bio',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
      </head>
      <body className={poppins.className}>
        <Web3ModalProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </Web3ModalProvider>
      </body>
    </html>
  )
}