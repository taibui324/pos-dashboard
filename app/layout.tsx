import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daspace POS Dashboard",
  description: "Mock UI preview for the Daspace POS dashboard"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-inter antialiased">{children}</body>
    </html>
  );
}
