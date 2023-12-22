import type { Metadata } from "next";
// import { Inter } from 'next/font/google'
import "./globals.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./Theme";
import Providers from "./provider";

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "X",
  description: "X clone created with Next.js 14",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
      <ThemeProvider theme={theme}>
        <Providers>{children}</Providers>
      </ThemeProvider>
      </body>
    </html>
  );
}
