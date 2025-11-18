import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StarPath Platform | Go4it Sports Academy",
  description: "Train Here. Learn Everywhere. Graduate Globally Competitive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#05070b] text-white">
        {children}
      </body>
    </html>
  );
}
