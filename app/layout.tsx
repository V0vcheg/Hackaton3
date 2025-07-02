import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "@/components/query/ReactQueryProvider";
import {initializeAgGrid} from "@/lib/agGrid";
import AppToaster from "@/components/ui/toaster";
import { LanguageProvider } from "@/hooks/useLanguage";
import { ToastProvider } from "@/hooks/useToast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinkESTIAM",
  description: "Plateforme sécurisée de gestion de fichiers LinkESTIAM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <bodyclassName={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReactQueryProvider>
        <LanguageProvider>
          <ToastProvider>

          {children}
          </ToastProvider>
        </LanguageProvider>
        <AppToaster />
      </ReactQueryProvider>
      </body>
    </html>
  );
}
