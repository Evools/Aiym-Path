import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { ToastProvider } from "@/context/ToastContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Aiym Path | Female-Friendly Туризм",
  description: "Безопасные, комфортные и вдохновляющие путешествия для женщин. Проверенные маршруты, отели, гиды и комьюнити.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} ${nunitoSans.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-white text-[#0D0D0D] selection:bg-[rgba(7,98,106,0.20)] selection:text-[#07626A]">
        <LanguageProvider>
          <ToastProvider>
            <Header />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
