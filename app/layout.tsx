import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "YukMagang — Platform PKL Siswa SMK Berbasis Skill & Portfolio",
  description: "Cari PKL yang sesuai dengan keahlianmu, selesaikan study case industri nyata, dan bangun bukti portfolio terverifikasi.",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-brand-100 selection:text-brand-900">
        {children}
      </body>
    </html>
  );
}