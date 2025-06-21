"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Home, Search, Plus, User } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { PrimaryBrandLogo } from "./branding/Cr8orBranding";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/marketplace", label: "Marketplace", icon: Search },
  { href: "/create", label: "Create", icon: Plus },
  { href: "/dashboard", label: "Dashboard", icon: User },
];

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800"
    >
      <div className="max-w-7xl mx-auto h-fit px-4">
        <div className="flex items-center justify-between h-fit">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 h-fit">
            <PrimaryBrandLogo />

            {/* <span className="text-xl font-bold text-white">Cr8or</span> */}
            <Badge
              variant="secondary"
              className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs"
            >
              BETA
            </Badge>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`
                      flex items-center gap-2 transition-all duration-200
                      ${
                        isActive
                          ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
                          : "text-slate-300 hover:text-white hover:bg-slate-800"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Desktop Wallet Connect */}
          <div className="hidden md:block">
            <ConnectButton
              accountStatus={{
                smallScreen: "avatar",
                largeScreen: "avatar",
              }}
              chainStatus={{
                smallScreen: "icon",
                largeScreen: "icon",
              }}
              showBalance={{
                smallScreen: true,
                largeScreen: true,
              }}
            />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isMobileMenuOpen ? 1 : 0,
            height: isMobileMenuOpen ? "auto" : 0,
          }}
          transition={{ duration: 0.2 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`
                      w-full justify-start gap-2
                      ${
                        isActive
                          ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
                          : "text-slate-300 hover:text-white hover:bg-slate-800"
                      }
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}

            <div className="pt-4 border-t border-slate-800">
              <ConnectButton
                accountStatus={{
                  smallScreen: "avatar",
                  largeScreen: "address",
                }}
                chainStatus={{
                  smallScreen: "icon",
                  largeScreen: "icon",
                }}
                showBalance={{
                  smallScreen: true,
                  largeScreen: true,
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
