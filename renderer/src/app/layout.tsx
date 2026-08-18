import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryProvider } from "@/lib";
import { Inter, Outfit, } from "next/font/google";
import { ThemeProvider } from "@/providers";
import { CustomToaster } from "@/utils";
import { AuthProvider, SyncProvider } from "@/contexts";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { NotificationDetail } from "@/components/shared/notifications";
import { TimeTravelLock } from "@/components/shared/security/time-travel-lock";
import { AutoUpdateManager } from "@/components/client/auto-update/auto-update-manager";
import { ElectronTitleBar } from "@/components/templates/electron-title-bar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Mindgest",
  description: "Software de Gestão e Faturação",
  icons: {
    icon: "/mindgest.png",
    shortcut: "/mindgest.png",
    apple: "/mindgest.png",
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
        <ElectronTitleBar />
        <div className="electron-app-content">
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
                <SyncProvider>
                  <NuqsAdapter>
                    {children}
                    <AutoUpdateManager />
                    <CustomToaster />
                    <NotificationDetail />
                    <TimeTravelLock />
                  </NuqsAdapter>
                </SyncProvider>
              </AuthProvider>
            </ReactQueryProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
