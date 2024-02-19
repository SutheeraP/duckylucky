import "./globals.css";
import SessionProvider from './SessionProvider';

import { Mali } from "@next/font/google";
const mali = Mali({
  subsets: ["latin", "thai"],
  weight: ["200", "300", "400", "500", "600"],
});

import React from "react";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">

      <body>
        <div className={mali.className}>

        <SessionProvider>
     
            {children}
       
        </SessionProvider>
        </div>

      </body>
    </html>
  );
}
