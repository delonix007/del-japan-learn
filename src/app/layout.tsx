import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NavShell } from "@/components/NavShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Del-Japan Learn | 日本語を学ぼう",
  description:
    "Belajar Bahasa Jepang dari nol sampai mahir. Kurikulum Minna no Nihongo dengan Kanji, Kana, Tata Bahasa, dan Latihan Interaktif.",
  keywords: ["belajar jepang", "JLPT N5", "JLPT N4", "minna no nihongo", "bahasa jepang"],
  openGraph: {
    title: "Del-Japan Learn | 日本語を学ぼう",
    description: "Belajar Bahasa Jepang from zero to hero!",
    type: "website",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta name="theme-color" content="#0f0f14" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Del-Japan" />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            <NavShell>{children}</NavShell>
          </AuthProvider>
        </ThemeProvider>
        <Script strategy="afterInteractive">
          {`if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js'); }`}
        </Script>
      </body>
    </html>
  );
}
