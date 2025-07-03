import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "@/components/query/ReactQueryProvider";
import { LanguageProvider } from "@/hooks/useLanguage";
import { ToastProvider } from "@/hooks/useToast";
import AppToaster from "@/components/ui/toaster";

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
      <body className="font-sans antialiased">
        <ReactQueryProvider>
          <LanguageProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </LanguageProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
