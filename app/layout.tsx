import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const BASE_URL = 'https://getbriefed.ai'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'Briefed — Know Your Role Before Day One',
  description:
    'Paste any job description, upload your resume, and get a personalized field guide with match score, interview talking points, competitor analysis, and career strategy — powered by Claude AI.',
  keywords: ['briefed', 'job preparation', 'AI', 'resume analysis', 'sales enablement', 'interview prep', 'career', 'field guide'],
  authors: [{ name: 'Brain Blooms LLC' }],
  openGraph: {
    title: 'Briefed — Know Your Role Before Day One',
    description: 'Upload your resume + paste a job description. Get a personalized match score, interview talking points, and a full industry field guide in under 60 seconds.',
    type: 'website',
    url: BASE_URL,
    siteName: 'Briefed',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Briefed — Know Your Role Before Day One',
    description: 'Upload your resume + paste a job description. Personalized match score, talking points, and industry field guide in 60 seconds.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
