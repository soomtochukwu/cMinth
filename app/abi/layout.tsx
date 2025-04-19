"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ConnectButton />
      {children}
    </>
  );
}
