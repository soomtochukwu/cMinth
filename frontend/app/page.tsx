"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Music, Palette, Zap, Shield, Globe, Users } from "lucide-react"
import Link from "next/link"
import { AnimatedBackground } from "@/components/animated-background"
import { StatsSection } from "@/components/stats-section"
import { FeatureCard } from "@/components/feature-card"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <AnimatedBackground />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <motion.div
          className="max-w-6xl mx-auto text-center z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium backdrop-blur-sm">
              🎵 Decentralized Creator Economy
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent"
          >
            Mint. Share. Earn.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            The first decentralized platform where creators mint NFTs of their audio and art content with built-in
            royalty splits. Own your creativity, monetize your passion.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/marketplace">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                Explore Marketplace
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/create">
              <Button
                variant="outline"
                size="lg"
                className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm"
              >
                Start Creating
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Built for creators, by creators. Experience the future of digital content monetization.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Music className="w-8 h-8" />}
              title="Audio NFTs"
              description="Mint your music, podcasts, and audio content as unique NFTs with built-in royalty distribution."
              gradient="from-purple-500 to-pink-500"
            />
            <FeatureCard
              icon={<Palette className="w-8 h-8" />}
              title="Digital Art"
              description="Transform your visual creations into valuable NFTs with provable ownership and authenticity."
              gradient="from-cyan-500 to-blue-500"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Instant Royalties"
              description="Earn 90% of every sale automatically with our smart contract royalty system."
              gradient="from-emerald-500 to-teal-500"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Secure & Decentralized"
              description="Your content is stored on IPFS with blockchain-verified ownership and authenticity."
              gradient="from-orange-500 to-red-500"
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8" />}
              title="Global Marketplace"
              description="Reach collectors worldwide with our intuitive marketplace and discovery features."
              gradient="from-violet-500 to-purple-500"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Creator Community"
              description="Join a thriving community of artists, musicians, and digital creators."
              gradient="from-indigo-500 to-blue-500"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border-purple-500/30 backdrop-blur-sm">
              <CardContent className="p-12">
                <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Monetize Your Creativity?</h3>
                <p className="text-xl text-slate-300 mb-8">
                  Join thousands of creators who are already earning from their digital content.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/create">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-4 text-lg font-semibold rounded-xl"
                    >
                      Start Minting Now
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/marketplace">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 px-8 py-4 text-lg font-semibold rounded-xl"
                    >
                      Browse Collection
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
