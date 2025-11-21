import type { Metadata, Viewport } from 'next'
import './globals.css'
import { EmotionProvider } from '@/context/EmotionContext'

export const metadata: Metadata = {
  title: 'Emotionagotchi',
  description: 'Your emotional wellness companion',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <EmotionProvider>
          {children}
        </EmotionProvider>
      </body>
    </html>
  )
}
