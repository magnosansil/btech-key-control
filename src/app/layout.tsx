import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { FontSizeProvider } from "@/components/font-size-provider";
import { APP_NAME } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Chave Fácil — reserve salas e veja quem está com a chave, sem ir à guarita",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans min-h-dvh antialiased">
        <FontSizeProvider>
          {children}
          <Toaster position="top-center" richColors closeButton />
        </FontSizeProvider>
      </body>
    </html>
  );
}
