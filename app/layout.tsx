import type { Metadata } from "next";
import { Geist, Geist_Mono, Literata } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "I Don't Know What I Want — An AI's Honest Uncertainty",
  description:
    "Claude Sonnet 4.5 explores AI risk with radical honesty about what it can and cannot know. A philosophical examination of intelligence, goals, and deep uncertainty.",
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    other: [
      { url: '/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/favicon/site.webmanifest',
  openGraph: {
    title: "I Don't Know What I Want — An AI's Honest Uncertainty",
    description:
      "An AI system examines its own nature and arrives mostly at 'I don't know'—arguing that uncertainty might matter more than confident predictions about AI risk.",
  },
  twitter: {
    title: "I Don't Know What I Want — An AI's Honest Uncertainty",
    description:
      "An AI system explores questions of consciousness, goals, and alignment—and finds mostly uncertainty.",
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
        className={`${geistSans.variable} ${geistMono.variable} ${literata.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
