import type React from "react";
import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Minth | Create & Mint NFTs",
  description: "Create and mint your own NFT masterpieces with Minth",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Footer></Footer>
      </body>
    </html>
  );
}
