
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from './SessionProvider';

import React from "react";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>

        <SessionProvider>
     
            {children}
       
        </SessionProvider>

      </body>
    </html>
  );
}
