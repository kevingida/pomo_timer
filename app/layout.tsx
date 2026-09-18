import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/features/theme/providers/ThemeProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { TaskProvider } from "@/features/task/providers/TaskProvider";
import SettingsProvider from "@/features/settings/providers/SettingsProvider";
import { ParticleProvider } from "@/features/theme/context/ParticleContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pomodoro Timer",
  description: "A focused Pomodoro timer with tasks, themes, and picture-in-picture mode.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SettingsProvider>
          <ThemeProvider>
            <ParticleProvider>
              <TaskProvider>
                <ToastProvider>{children}</ToastProvider>
              </TaskProvider>
            </ParticleProvider>
          </ThemeProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
