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
