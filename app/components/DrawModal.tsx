/* eslint-disable @typescript-eslint/ban-ts-comment */
// components/Modal.js
"use client";

import { useEffect } from "react";

// @ts-ignore
export default function DrawModal({ isOpen, onClose, children }) {
  useEffect(() => {
    // @ts-ignore
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    } else {
      document.removeEventListener("keydown", handleEsc);
    }

    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="w-5/6 h-5/6 left-10 fixed z-10 shadow-2xl">
      <iframe
        src="/Canvas/draw.html"
        frameBorder="3"
        title="Make your own NFT"
        className="w-full h-full border-gr rounded-2xl "
      >
        {children}
      </iframe>
    </div>
  );
}
