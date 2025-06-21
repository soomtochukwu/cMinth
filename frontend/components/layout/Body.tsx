"use client";

import React from "react";
import "../../app/globals.css";
import { Navigation } from "@/components/navigation";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import { Providers } from "@/app/providers";

const Body = ({ children }: { children: React.ReactNode }) => {
  return (
    <body>
      <Providers>
        <Navigation />
        {children}
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
  );
};

export default Body;
