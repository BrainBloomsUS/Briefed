import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Briefed — Know Your Role Before Day One',
  description:
    'Paste any job description and get a structured, course-style field guide covering products, tools, competitors, and career strategy — powered by Claude AI.',
  keywords: ['briefed', 'job preparation', 'AI', 'sales enablement', 'onboarding', 'field guide'],
  openGraph: {
    title: 'Briefed — Know Your Role Before Day One',
    description: 'Get fully briefed on any job — products, tools, competitors, and career strategy. Powered by Claude AI.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Briefed',
    description: 'Know your role before day one. AI-powered field guides for any job description.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
