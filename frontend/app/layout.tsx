import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import Body from "@/components/layout/Body";

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
      <Body children={children}></Body>
    </html>
  );
}
