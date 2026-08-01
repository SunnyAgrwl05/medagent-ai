import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MedAgent AI — Your Autonomous Multi-Agent Healthcare Assistant",
  description:
    "Five specialized AI agents for symptoms, medical reports, medicine identification, voice consultations, and health summaries — powered by Gemini 2.5 Flash.",
  keywords: [
    "MedAgent AI",
    "healthcare AI",
    "Gemini healthcare assistant",
    "AI symptom checker",
    "medical report analyzer",
  ],
  authors: [{ name: "MedAgent AI" }],
  openGraph: {
    title: "MedAgent AI — Your Autonomous Multi-Agent Healthcare Assistant",
    description:
      "Five specialized AI agents for symptoms, reports, medicine, voice, and health summaries.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#0abfae",
          colorText: "#0f172a",
          borderRadius: "0.9rem",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${sora.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster
              richColors
              position="top-right"
              theme="system"
              toastOptions={{
                className: "font-sans",
              }}
            />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
