import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Go4It Sports Platform',
  description: 'Advanced sports analytics platform for neurodivergent student athletes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-white">
        {children}
      </body>
    </html>
  );
}