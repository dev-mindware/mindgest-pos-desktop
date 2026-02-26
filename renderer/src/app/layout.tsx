import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryProvider } from "@/lib";
import { Inter, Outfit, } from "next/font/google";
import { ThemeProvider } from "@/providers";
import { CustomToaster } from "@/utils";
import { SidebarProvider } from "@/components";
import { AuthProvider } from "@/contexts";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { NotificationDetail } from "@/components/shared/notifications";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "MindGest",
  description: "Software de Gestão e Faturação",
  icons: {
    icon: "/mindware.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable}  ${outfit.variable}`}
    >
      <body
        className="antialiased"
        style={{ fontFamily: "var(--font-family)" }}
      >
        <ThemeProvider
          enableSystem
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          themes={["light", "dark", "system"]}
          storageKey="mindware-theme"
        >
          <ReactQueryProvider>
            <AuthProvider>
              <NuqsAdapter>
                <SidebarProvider>{children}</SidebarProvider>
                <CustomToaster />
                <NotificationDetail />
              </NuqsAdapter>
            </AuthProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
