import "./globals.css";
import SessionProvider from './SessionProvider';

import React from "react";

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
