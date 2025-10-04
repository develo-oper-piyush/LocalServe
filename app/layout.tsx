import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { BookingProvider } from "@/contexts/booking-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LocalServe - Find Trusted Local Services Near You",
  description:
    "Connect with verified professionals for all your home service needs. Book carpenters, electricians, plumbers, cleaners and more.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          id="omnidimension-web-widget"
          async
          src="https://backend.omnidim.io/web_widget.js?secret_key=6320c1768a2a6dbdab71b93a0f09d7db"
        />
      </head>
      <body className={inter.className}>
        <BookingProvider>{children}</BookingProvider>
      </body>
    </html>
  )
}
