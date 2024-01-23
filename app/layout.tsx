import type { Metadata } from "next";
import { Lexend_Mega } from "next/font/google";
import "./globals.css";

const inter = Lexend_Mega({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Photobooth - Developed by Zirolu",
  description: "AI Photobooth - Developed by Zirolu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
