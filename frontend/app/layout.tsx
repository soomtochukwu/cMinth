import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Toaster } from "react-hot-toast";
import Web3Provider from "./web3.providers";
import Footer from "@/components/Footer";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Cr8or - Decentralized Creator Monetization",
  description:
    "The first decentralized platform where creators mint NFTs of their audio and art content with built-in royalty splits.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#1e293b",
                color: "#fff",
                border: "1px solid #475569",
              },
            }}
          />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
