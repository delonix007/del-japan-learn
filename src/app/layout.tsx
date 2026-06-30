import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Del-Japan Learn | Belajar Bahasa Jepang JLPT N5-N4",
  description:
    "Belajar Bahasa Jepang dari nol dengan kurikulum Minna no Nihongo. Lengkap dengan Kanji, Kana, Tata Bahasa, dan Latihan Interaktif.",
  keywords: ["belajar jepang", "JLPT N5", "JLPT N4", "minna no nihongo", "bahasa jepang"],
  openGraph: {
    title: "Del-Japan Learn | Belajar Bahasa Jepang",
    description: "Belajar Bahasa Jepang from zero to hero!",
    type: "website",
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#dc2626" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
