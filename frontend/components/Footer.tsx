"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Twitter, DiscIcon as Discord, Globe } from "lucide-react";
import { Wordmark } from "./branding/Cr8orBranding";

export default function Footer() {
  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Discord, href: "#", label: "Discord" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Globe, href: "#", label: "Website" },
  ];

  return (
    <footer className="bg-slate-950/80 backdrop-blur-md border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-1">
            <div className="flex items-center">
              {/* <span className="text-xl font-bold text-white"></span> */}
              <Wordmark size={35} />
            </div>
            <p className="text-slate-400 text-sm">
              Empowering creators through decentralized NFT monetization with
              built-in royalty splits.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <div className="space-y-2">
              <Link
                href="/marketplace"
                className="block text-slate-400 hover:text-white transition-colors text-sm"
              >
                Marketplace
              </Link>
              <Link
                href="/create"
                className="block text-slate-400 hover:text-white transition-colors text-sm"
              >
                Create NFT
              </Link>
              <Link
                href="#"
                className="block text-slate-400 hover:text-white transition-colors text-sm"
              >
                Analytics
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <div className="space-y-2">
              <Link
                href="#"
                className="block text-slate-400 hover:text-white transition-colors text-sm"
              >
                Documentation
              </Link>
              <Link
                href="#"
                className="block text-slate-400 hover:text-white transition-colors text-sm"
              >
                Help Center
              </Link>
              <Link
                href="#"
                className="block text-slate-400 hover:text-white transition-colors text-sm"
              >
                Community
              </Link>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 flex items-baseline space-x-2 text-sm">
            <span> © 2025 </span> <Wordmark size={20} />. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link
              href="#"
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
