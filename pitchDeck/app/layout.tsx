import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cr8or Pitch Deck",
  description:
    "The first decentralized platform where creators mint NFTs of their audio and art content with built-in royalty splits.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
