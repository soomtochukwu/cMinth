"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, X } from "lucide-react";
import Link from "next/link";

interface Web3ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: Web3ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof window === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm animate-fadeIn overflow-auto pt-10 text-white"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-screen-lg mx-auto p-6 rounded-2xl shadow-xl border border-white/10 bg-inherit text-white animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition group"
        >
          <X className="w-5 h-5 text-white group-hover:text-pink-500 drop-shadow-glow" />
        </button>

        <Link href={"create/on-the-go"} title="Draw in a new page.">
          <ExternalLink />
        </Link>
        {children}
      </div>
    </div>,
    document.body
  );
}
