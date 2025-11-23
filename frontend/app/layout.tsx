import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import Body from "@/components/layout/Body";

export const metadata: Metadata = {
  title: "Cr8or - Decentralized Creator Monetization",
  description:
    "The first decentralized platform where creators mint NFTs of their audio and art content with built-in royalty splits.",
  manifest: "/manifest.json",
  other: {
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: "https://www.minth.art/OT.png",
      button: {
        title: "Launch App",
        action: {
          type: "launch_frame",
          name: "Minth Art",
          url: "https://www.minth.art/",
          splashImageUrl: "https://www.minth.art/OT.png",
          splashBackgroundColor: "#020617",
        },
      },
    }),
  },
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
