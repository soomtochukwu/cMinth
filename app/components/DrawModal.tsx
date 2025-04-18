/* eslint-disable @typescript-eslint/ban-ts-comment */
// components/Modal.js
"use client";

import { useEffect } from "react";

// @ts-ignore
export default function DrawModal({ isOpen, onClose, children }) {
  useEffect(() => {
    // @ts-ignore
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        document.body.style.overflow = "visible";
        onClose();
      }
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
    <div
      id="dc"
      onLoad={() => {
        document.body.style.overflow = "hidden";
        // @ts-ignore
        document.getElementById("dc").style.left =
          (document.body.offsetWidth -
            // @ts-ignore
            document.getElementById("dc").offsetWidth) /
            2 +
          "px";
        //
        // @ts-ignore
        document.getElementById("dc").style.top =
          (document.body.offsetHeight -
            // @ts-ignore
            document.getElementById("dc").offsetHeight) /
            2 +
          "px";
      }}
      className="w-5/6 h-5/6 left-10 fixed z-30 shadow-2xl overflow-hidden"
    >
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
