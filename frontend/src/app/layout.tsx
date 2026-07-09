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
  title: "Shahrukh Faisal | AI & Systems Engineer",
  description: "Interactive VS Code-style developer portfolio for Shahrukh Faisal, AI & Systems Engineer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-dvh w-dvw overflow-hidden antialiased`}
    >
      <body className="h-full w-full flex flex-col overflow-hidden">{children}</body>
    </html>
  );
}
