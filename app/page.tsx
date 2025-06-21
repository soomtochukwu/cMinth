"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAccount } from "wagmi";
import ParticleBackground from "@/components/ParticleBackground";
import { motion } from "framer-motion";
import { Minth_address, Minth_address_lisk } from "@/utils/var";
import WalletConnectButton from "@/components/walletConnectButton";
// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export interface NFTAttribute {
  trait_type: string;
  value: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
}

export interface NFT {
  id: number;
  owner: string;
  uri: string;
  metadata: NFTMetadata;
  imageUrl: string;
}
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function LandingPage() {
  const //
    [isScrolled, setIsScrolled] = useState(false),
    [NFT, setNfts] = useState<NFT[]>([]),
    [loading, setLoading] = useState<boolean>(true);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isConnected } = useAccount();

  // Handle scroll events for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    fetch("/api/getMetadata")
      .then((res) => res.json())
      .then((data) => {
        setNfts(data);
        console.log(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load metadata:", err);
      });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants

  // Animation variants

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <ParticleBackground />

      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "py-2 bg-black/80 backdrop-blur-lg shadow-lg shadow-cyan-500/10"
            : "py-4 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 text-transparent bg-clip-text relative group">
              MINTH
              <span className="absolute -inset-1 rounded-lg blur-sm bg-gradient-to-r from-cyan-500/20 to-purple-500/20 group-hover:blur-md transition-all duration-300"></span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="/" label="Home" />
            <NavLink href="/#features" label="Features" />
            <NavLink href="/#how-it-works" label="How It Works" />
            <NavLink href="/gallery" label="Gallery" />
            <NavLink href="/#contact" label="Contact" />
          </nav>

          {/* Connect Wallet Button (Desktop) */}
          <div className="hidden md:block">
            <WalletConnectButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden absolute w-full bg-gray-900/95 backdrop-blur-lg transition-all duration-300 ease-in-out border-b border-gray-800/50 ${
            isMobileMenuOpen
              ? "max-h-96 py-4"
              : "max-h-0 py-0 overflow-hidden border-none"
          }`}
        >
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <MobileNavLink
              href="/"
              label="Home"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <MobileNavLink
              href="/#features"
              label="Features"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <MobileNavLink
              href="/#how-it-works"
              label="How It Works"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <MobileNavLink
              href="/gallery"
              label="Gallery"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <MobileNavLink
              href="/#contact"
              label="Contact"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="py-2">
              <WalletConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <motion.div
            className="md:w-1/2 mb-12 md:mb-0"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-600 text-transparent bg-clip-text">
                Transform Your Art
              </span>{" "}
              <br />
              Into Digital Assets
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-lg">
              Create, mint, and trade unique NFTs with our intuitive canvas
              tools. Your imagination is the only limit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/create"
                className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-lg text-white font-medium transition-all duration-300 shadow-lg shadow-purple-500/20 text-center"
              >
                Start Creating
              </Link>
              <Link
                href="/#how-it-works"
                className="px-8 py-4 bg-gray-800/60 hover:bg-gray-700/60 backdrop-blur-md rounded-lg text-white font-medium transition-all duration-300 border border-gray-700/50 text-center"
              >
                Learn More
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="md:w-1/2 relative"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg blur-xl -z-10"></div>
              <div className="w-full h-full rounded-lg overflow-hidden border border-gray-800/50 shadow-xl shadow-cyan-500/10">
                {loading ? (
                  <div className="p-4 rounded-full border-2 border-violet-700 animate-spin "></div>
                ) : (
                  <img
                    src={NFT[NFT?.length - 1]?.imageUrl}
                    alt="NFT Canvas Preview"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {NFT[NFT?.length - 1]?.metadata.name} #
                      {NFT[NFT?.length - 1]?.id}
                    </h3>
                    <p className="text-cyan-400 text-sm">
                      Created with Minth Canvas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-600 text-transparent bg-clip-text inline-block">
              Powerful Features
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to create stunning NFTs and join the digital
              art revolution.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <FeatureCard
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                  <path d="M2 2l7.586 7.586"></path>
                  <circle cx="11" cy="11" r="2"></circle>
                </svg>
              }
              title="Intuitive Canvas"
              description="Create digital art with our powerful drawing tools. Includes brushes, shapes, text, and more."
            />

            <FeatureCard
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              }
              title="Upload Existing Art"
              description="Already have artwork? Simply upload your images and mint them as NFTs in seconds."
            />

            <FeatureCard
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              }
              title="IPFS Storage"
              description="Your artwork is stored on IPFS, ensuring it remains decentralized and accessible forever."
            />

            <FeatureCard
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              }
              title="NFT Templates"
              description="Choose from a variety of templates to showcase your art in the most appealing way."
            />

            <FeatureCard
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              }
              title="User-Friendly"
              description="No technical knowledge required. Our platform makes NFT creation accessible to everyone."
            />

            <FeatureCard
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              }
              title="Secure Minting"
              description="Mint your NFTs securely on the blockchain with our gas-efficient smart contract."
            />
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-600 text-transparent bg-clip-text inline-block">
              How It Works
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Creating and minting your NFTs has never been easier. Follow these
              simple steps to get started.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <StepCard
              number="01"
              title="Create or Upload"
              description="Draw your artwork using our canvas tools or upload an existing image."
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                  <path d="M2 2l7.586 7.586"></path>
                  <circle cx="11" cy="11" r="2"></circle>
                </svg>
              }
            />

            <StepCard
              number="02"
              title="Store on IPFS"
              description="Your artwork is automatically uploaded to IPFS for permanent, decentralized storage."
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              }
            />

            <StepCard
              number="03"
              title="Mint Your NFT"
              description="Connect your wallet and mint your artwork as an NFT on the blockchain."
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                  <circle cx="12" cy="12" r="2"></circle>
                  <path d="M6 12h.01M18 12h.01"></path>
                </svg>
              }
            />
          </motion.div>

          <motion.div
            className="mt-16 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Link
              href="/create"
              className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-lg text-white font-medium transition-all duration-300 shadow-lg shadow-purple-500/20 inline-block"
            >
              Start Creating Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="py-20 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-600 text-transparent bg-clip-text inline-block">
              Featured Creations
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore some of the amazing NFTs created by our community using
              Minth.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {NFT.slice(-4).map((nft, index) => (
              <NFTCard
                key={index}
                image={nft?.imageUrl}
                title={nft?.metadata?.name}
                creator={nft?.owner}
              />
            ))}
          </motion.div>

          <motion.div
            className="mt-12 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Link
              href="/gallery"
              className="px-6 py-3 bg-gray-800/60 hover:bg-gray-700/60 backdrop-blur-md rounded-lg text-white font-medium transition-all duration-300 border border-gray-700/50 inline-flex items-center gap-2"
            >
              View Full Gallery
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Ready to Turn Your Art Into{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-600 text-transparent bg-clip-text">
                Digital Assets?
              </span>
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Join thousands of artists who have already minted their NFTs with
              Minth. Start creating today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/create"
                className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-lg text-white font-medium transition-all duration-300 shadow-lg shadow-purple-500/20 text-center"
              >
                Start Creating
              </Link>
              {!isConnected && (
                <div className="py-1">
                  <WalletConnectButton />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-600 text-transparent bg-clip-text inline-block">
              Get In Touch
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </motion.div>

          <motion.div
            className="max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gray-800/50 shadow-lg shadow-cyan-500/10 p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-400 mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-400 mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-400 mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Subject"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-400 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-lg text-white font-medium transition-all duration-300 shadow-lg shadow-purple-500/20"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800/50 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center mb-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 text-transparent bg-clip-text">
                  MINTH
                </h1>
              </Link>
              <p className="text-gray-400 mb-4">
                Create, mint, and trade unique NFTs with our intuitive platform.
              </p>
              <div className="flex space-x-4">
                <SocialIcon href="#" icon="twitter" />
                <SocialIcon href="#" icon="discord" />
                <SocialIcon href="#" icon="github" />
                <SocialIcon href="#" icon="telegram" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <FooterLink href="/" label="Home" />
                <FooterLink href="/#features" label="Features" />
                <FooterLink href="/#how-it-works" label="How It Works" />
                <FooterLink href="/gallery" label="Gallery" />
                <FooterLink href="/#contact" label="Contact" />
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <FooterLink href="#" label="Documentation" />
                <FooterLink href="#" label="Tutorials" />
                <FooterLink href="#" label="FAQs" />
                <FooterLink href="#" label="Support" />
                <FooterLink href="#" label="Terms of Service" />
              </ul>
            </div>

            <div className="flex flex-col">
              <h3 className="text-lg font-semibold mb-4">Smart Contract</h3>
              <Link
                href={`https://celo-alfajores.blockscout.com/address/${Minth_address}?tab=contract`}
                target="_blank"
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors break-all"
              >
                Alfajores:{" "}
                {Minth_address.replace(
                  Minth_address.slice(3, Minth_address.length - 3),
                  "..."
                )}
              </Link>
              <Link
                href={`https://sepolia-blockscout.lisk.com/address/${Minth_address_lisk}?tab=contract`}
                target="_blank"
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors break-all"
              >
                Lisk Sepolia:{" "}
                {Minth_address_lisk.replace(
                  Minth_address_lisk.slice(3, Minth_address_lisk.length - 3),
                  "..."
                )}
              </Link>

              <p className="text-gray-400 mt-4 text-sm">
                Deployed on Alfajores and Lisk Sepolia Testnet. View the
                contract details and transactions.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800/50 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Minth. All rights reserved. Created
              with 💙 by{" "}
              <Link
                href="https://somtochukwu-ko.vercel.app/"
                className="text-cyan-400 hover:text-cyan-300"
              >
                Somtochukwu
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Navigation Link Component
function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-gray-300 hover:text-white transition-colors relative group"
    >
      {label}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
}

// Mobile Navigation Link Component
function MobileNavLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      className="text-gray-300 hover:text-white transition-colors py-2 block"
      onClick={onClick}
    >
      {label}
    </Link>
  );
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gray-800/50 shadow-lg shadow-cyan-500/10 p-6 transition-all duration-300 hover:shadow-cyan-500/20 hover:border-gray-700/70 group"
      variants={fadeIn}
    >
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-900/50 to-purple-900/50 flex items-center justify-center mb-6 text-cyan-400 group-hover:text-cyan-300 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}

// Step Card Component
function StepCard({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div className="relative" variants={fadeIn}>
      <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gray-800/50 shadow-lg shadow-cyan-500/10 p-8 transition-all duration-300 hover:shadow-cyan-500/20 hover:border-gray-700/70 group">
        <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-gradient-to-r from-cyan-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20">
          {number}
        </div>
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-900/50 to-purple-900/50 flex items-center justify-center mb-6 text-cyan-400 mx-auto">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-3 text-center">{title}</h3>
        <p className="text-gray-400 text-center">{description}</p>
      </div>
    </motion.div>
  );
}

// NFT Card Component
function NFTCard({
  image,
  title,
  creator,
}: {
  image: string;
  title: string;
  creator: string;
}) {
  return (
    <motion.div className="group" variants={fadeIn}>
      <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gray-800/50 shadow-lg shadow-cyan-500/10 overflow-hidden transition-all duration-300 hover:shadow-cyan-500/20 hover:border-gray-700/70">
        <div className="relative aspect-square">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            width={400}
            height={400}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="text-cyan-400 text-sm">By {creator}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Social Icon Component
function SocialIcon({ href, icon }: { href: string; icon: string }) {
  let iconSvg;

  switch (icon) {
    case "twitter":
      iconSvg = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
        </svg>
      );
      break;
    case "discord":
      iconSvg = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
        </svg>
      );
      break;
    case "github":
      iconSvg = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      );
      break;
    case "telegram":
      iconSvg = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M9.417 15.181l-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931l3.622-16.972.001-.001c.321-1.496-.541-2.081-1.527-1.714l-21.29 8.151c-1.453.564-1.431 1.374-.247 1.741l5.443 1.693 12.643-7.911c.595-.394 1.136-.176.691.218l-10.226 9.183z" />
        </svg>
      );
      break;
    default:
      iconSvg = null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-cyan-400 transition-colors"
    >
      {iconSvg}
    </a>
  );
}

// Footer Link Component
function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-gray-400 hover:text-cyan-400 transition-colors"
      >
        {label}
      </Link>
    </li>
  );
}
