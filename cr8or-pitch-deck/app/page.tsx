"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Users,
  DollarSign,
  Shield,
  Zap,
  Globe,
  TrendingUp,
  Target,
  Clock,
  ExternalLink,
  Hexagon,
  Network,
  Cpu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const slides = [
  { id: 1, title: "Title", component: "TitleSlide" },
  { id: 2, title: "Overview", component: "OverviewSlide" },
  { id: 3, title: "Problem", component: "ProblemSlide" },
  { id: 4, title: "Solution", component: "SolutionSlide" },
  { id: 5, title: "Revenue", component: "RevenueSlide" },
  { id: 6, title: "How It Works", component: "HowItWorksSlide" },
  { id: 7, title: "Tech Stack", component: "TechStackSlide" },
  { id: 8, title: "Competitive Advantage", component: "CompetitiveSlide" },
  { id: 9, title: "Timeline", component: "TimelineSlide" },
  { id: 10, title: "Risks", component: "RisksSlide" },
  { id: 11, title: "Team", component: "TeamSlide" },
  { id: 12, title: "Ask", component: "AskSlide" },
  { id: 13, title: "Closing", component: "ClosingSlide" },
]

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.4 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  }),
}

// Floating particles component for Web3 ambiance
function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

// Hexagonal grid background
function HexGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none opacity-5">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hexagons" x="0" y="0" width="100" height="87" patternUnits="userSpaceOnUse">
            <polygon points="50,1 85,25 85,62 50,86 15,62 15,25" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagons)" className="text-cyan-400" />
      </svg>
    </div>
  )
}

export default function Component() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(false)
  const [direction, setDirection] = useState(0)
  const [progressValue, setProgressValue] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(() => {
        setDirection(1)
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, 10000)
      return () => clearInterval(interval)
    }
  }, [isAutoPlay])

  useEffect(() => {
    // Animate progress bar
    const targetValue = ((currentSlide + 1) / slides.length) * 100
    const start = progressValue
    const duration = 500
    let startTime: number | null = null

    const animateProgress = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const percentage = Math.min(progress / duration, 1)
      const value = start + (targetValue - start) * percentage

      setProgressValue(value)

      if (percentage < 1) {
        requestAnimationFrame(animateProgress)
      }
    }

    requestAnimationFrame(animateProgress)
  }, [currentSlide])

  const nextSlide = () => {
    setDirection(1)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1)
    setCurrentSlide(index)
  }

  // Keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "ArrowRight" || event.key === " ") {
      event.preventDefault()
      nextSlide()
    } else if (event.key === "ArrowLeft") {
      event.preventDefault()
      prevSlide()
    }
  }, [])

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }
  }

  // Add keyboard event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  const renderSlide = () => {
    switch (slides[currentSlide].component) {
      case "TitleSlide":
        return <TitleSlide />
      case "OverviewSlide":
        return <OverviewSlide />
      case "ProblemSlide":
        return <ProblemSlide />
      case "SolutionSlide":
        return <SolutionSlide />
      case "RevenueSlide":
        return <RevenueSlide />
      case "HowItWorksSlide":
        return <HowItWorksSlide />
      case "TechStackSlide":
        return <TechStackSlide />
      case "CompetitiveSlide":
        return <CompetitiveSlide />
      case "TimelineSlide":
        return <TimelineSlide />
      case "RisksSlide":
        return <RisksSlide />
      case "TeamSlide":
        return <TeamSlide />
      case "AskSlide":
        return <AskSlide />
      case "ClosingSlide":
        return <ClosingSlide />
      default:
        return <TitleSlide />
    }
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white overflow-hidden relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Elements */}
      <HexGrid />
      <FloatingParticles />

      {/* Gradient Overlays */}
      <div className="fixed inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />

      {/* Navigation Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-xl border-b border-cyan-500/20"
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <div className="relative">
                <Hexagon className="w-8 h-8 text-cyan-400" />
                <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-sm" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Cr8or
              </h1>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-300">
                {currentSlide + 1} / {slides.length}
              </Badge>
            </motion.div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`text-white hover:bg-cyan-500/10 transition-colors border border-cyan-500/20 ${
                isAutoPlay ? "bg-cyan-500/20 text-cyan-300" : ""
              }`}
            >
              <Play className={`w-4 h-4 ${isAutoPlay ? "text-cyan-300" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={prevSlide}
              className="text-white hover:bg-cyan-500/10 transition-colors border border-cyan-500/20"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextSlide}
              className="text-white hover:bg-cyan-500/10 transition-colors border border-cyan-500/20"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-slate-800/50">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-400"
            style={{ width: `${progressValue}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.header>

      {/* Slide Navigation */}
      <motion.nav
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block"
      >
        <div className="flex flex-col gap-3 bg-black/20 backdrop-blur-xl rounded-2xl p-3 border border-cyan-500/20">
          {slides.map((slide, index) => (
            <motion.button
              key={slide.id}
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`w-3 h-3 rounded-full transition-all relative ${
                index === currentSlide
                  ? "bg-cyan-400 scale-125 shadow-lg shadow-cyan-400/50"
                  : "bg-slate-600 hover:bg-cyan-500/50"
              }`}
              title={slide.title}
            >
              {index === currentSlide && <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping" />}
            </motion.button>
          ))}
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              {renderSlide()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Slide Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 lg:hidden"
      >
        <div className="flex gap-2 bg-black/30 backdrop-blur-xl rounded-full px-4 py-2 border border-cyan-500/20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? "bg-cyan-400" : "bg-slate-600"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// Enhanced Card component with Web3 styling
function Web3Card({
  children,
  className = "",
  glowColor = "cyan",
}: { children: React.ReactNode; className?: string; glowColor?: string }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-slate-900/50 backdrop-blur-xl border border-${glowColor}-500/20 rounded-2xl relative overflow-hidden ${className}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-r from-${glowColor}-500/5 to-purple-500/5 opacity-50`} />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

// Slide Components with enhanced Web3 styling
function TitleSlide() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center text-center relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border border-cyan-500/10 rounded-full"
            style={{
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="space-y-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <h1 className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent relative">
              Cr8or
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 opacity-20 blur-3xl" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl md:text-4xl font-semibold text-slate-300"
          >
            Decentralized Creator Monetization
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center gap-4"
          >
            <Network className="w-6 h-6 text-cyan-400" />
            <p className="text-xl md:text-2xl text-cyan-300 font-medium">"Create, Own, Earn."</p>
            <Cpu className="w-6 h-6 text-purple-400" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="space-y-6 text-slate-400"
        >
          <p className="text-lg">Empowering artists and musicians to mint and sell NFTs with fair royalties</p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <span className="flex items-center gap-2">
              <Hexagon className="w-4 h-4 text-cyan-400" />
              Presented by Team 3
            </span>
            <span>•</span>
            <span>June 2025</span>
          </div>
          <motion.a
            href="https://cr8or.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors border border-cyan-500/30 rounded-full px-4 py-2 backdrop-blur-sm"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(34, 211, 238, 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            <Globe className="w-4 h-4" />
            cr8or.vercel.app
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </div>
    </div>
  )
}

function OverviewSlide() {
  return (
    <div className="space-y-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
      >
        Project Overview
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Web3Card glowColor="purple">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Hexagon className="w-5 h-5" />
                What is Cr8or?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                A decentralized NFT platform for artists and musicians to monetize digital art (JPG, PNG, GIF) and music
                (MP3, WAV).
              </motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                Creators mint NFTs via an ERC721 contract on Lisk L2 blockchain, with metadata stored on IPFS.
              </motion.p>
            </CardContent>
          </Web3Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Web3Card glowColor="cyan">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <Network className="w-5 h-5" />
                Key Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-300">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-cyan-500/10"
              >
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Drag-and-drop minting</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-blue-500/10"
              >
                <Globe className="w-4 h-4 text-blue-400" />
                <span>Experimental 2D canvas</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-green-500/10"
              >
                <DollarSign className="w-4 h-4 text-green-400" />
                <span>Integrated marketplace</span>
              </motion.div>
            </CardContent>
          </Web3Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Web3Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-2xl font-semibold text-purple-300 flex items-center justify-center gap-2"
              >
                <Target className="w-6 h-6" />
                MVP Goal
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-slate-300"
              >
                Deliver a functional MVP in 2 weeks with 5 test NFTs minted
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
                whileHover={{ scale: 1.05 }}
              >
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2">
                  Live Demo Available
                </Badge>
              </motion.div>
            </div>
          </CardContent>
        </Web3Card>
      </motion.div>
    </div>
  )
}

function ProblemSlide() {
  return (
    <div className="space-y-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent"
      >
        Problem Statement
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Web3Card glowColor="red" className="h-full">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                High Fees
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300">
              <p>Centralized platforms take up to 50% in fees, drastically reducing creator earnings.</p>
              <div className="mt-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <div className="text-red-300 font-semibold text-2xl">50%</div>
                <div className="text-xs text-red-400">Platform fees</div>
              </div>
            </CardContent>
          </Web3Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Web3Card glowColor="orange" className="h-full">
            <CardHeader>
              <CardTitle className="text-orange-400 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Lack of Control
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300">
              <p>Creators lack ownership and control over their content and revenue streams.</p>
              <div className="mt-4 flex items-center gap-2 text-orange-300">
                <Hexagon className="w-4 h-4" />
                <span className="text-sm">Centralized control</span>
              </div>
            </CardContent>
          </Web3Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Web3Card glowColor="yellow" className="h-full">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Complexity
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300">
              <p>NFT platforms are complex, expensive (high gas fees), and inaccessible to non-technical creators.</p>
              <div className="mt-4 flex items-center gap-2 text-yellow-300">
                <Network className="w-4 h-4" />
                <span className="text-sm">High barriers to entry</span>
              </div>
            </CardContent>
          </Web3Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Web3Card>
          <CardHeader>
            <CardTitle className="text-purple-400 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Who's Affected?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-2 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20"
              >
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <Hexagon className="w-4 h-4 text-cyan-400" />
                  Artists & Musicians
                </h4>
                <p className="text-slate-300">Part of the $250B creator economy (2025 est.)</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-2 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20"
              >
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <Network className="w-4 h-4 text-purple-400" />
                  Fans & Collectors
                </h4>
                <p className="text-slate-300">Seeking authentic digital assets and direct creator support</p>
              </motion.div>
            </div>
          </CardContent>
        </Web3Card>
      </motion.div>
    </div>
  )
}

function SolutionSlide() {
  return (
    <div className="space-y-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent"
      >
        Solution & Uniqueness
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <Web3Card glowColor="green">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                Our Solution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>90% royalty split for creators (10% platform fee)</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20"
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>User-friendly drag-and-drop interface</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20"
              >
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>MetaMask integration & IPFS storage</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20"
              >
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span>Built on Lisk L2 for low-cost transactions</span>
              </motion.div>
            </CardContent>
          </Web3Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <Web3Card glowColor="purple">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Network className="w-5 h-5" />
                What Makes Us Unique
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
                >
                  <span className="font-semibold">Fair Royalties</span>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">90% vs 50-80%</Badge>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20"
                >
                  <span className="font-semibold">Accessibility</span>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Simple UX</Badge>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20"
                >
                  <span className="font-semibold">Decentralized</span>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">IPFS + Lisk L2</Badge>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20"
                >
                  <span className="font-semibold">Niche Focus</span>
                  <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">Music/Art</Badge>
                </motion.div>
              </div>
            </CardContent>
          </Web3Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <Web3Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-2xl font-semibold text-blue-300 mb-4 flex items-center justify-center gap-2"
              >
                <Hexagon className="w-6 h-6" />
                Experimental 2D Canvas
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-slate-300"
              >
                Create NFTs on-the-go with our built-in canvas tool - no external software needed!
              </motion.p>
            </div>
          </CardContent>
        </Web3Card>
      </motion.div>
    </div>
  )
}

function RevenueSlide() {
  return (
    <div className="space-y-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"
      >
        Revenue Model
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Web3Card glowColor="green">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Primary Revenue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.4,
                    type: "spring",
                    stiffness: 100,
                  }}
                  className="relative"
                >
                  <div className="text-6xl font-bold text-green-400 mb-2 relative z-10">10%</div>
                  <div className="absolute inset-0 bg-green-400/20 blur-2xl rounded-full" />
                </motion.div>
                <p className="text-slate-300">Platform fee on all NFT sales (primary and secondary)</p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-green-500/20 rounded-lg p-4 border border-green-500/30"
              >
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  Cost Efficiency
                </h4>
                <p className="text-sm text-slate-300">Lisk L2 minimizes gas fees; IPFS reduces storage costs</p>
              </motion.div>
            </CardContent>
          </Web3Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Web3Card glowColor="blue">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Future Revenue Streams
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-300">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20"
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Premium creator tools (analytics dashboard)</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-purple-500/10 border border-purple-500/20"
              >
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Social features for fan engagement</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20"
              >
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span>Partnerships with music/art platforms</span>
              </motion.div>
            </CardContent>
          </Web3Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Web3Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
          <CardHeader>
            <CardTitle className="text-purple-400 text-center flex items-center justify-center gap-2">
              <Network className="w-5 h-5" />
              Revenue Projections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-center space-y-2 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20"
              >
                <h4 className="text-2xl font-bold text-purple-300">Year 1</h4>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 1,
                    type: "spring",
                    stiffness: 100,
                  }}
                  className="relative"
                >
                  <div className="text-4xl font-bold text-white">$250K</div>
                  <div className="absolute inset-0 bg-purple-400/20 blur-xl rounded-full" />
                </motion.div>
                <p className="text-sm text-slate-400">2.5K NFTs at $100 avg., 10% fee</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="text-center space-y-2 p-4 bg-pink-500/10 rounded-lg border border-pink-500/20"
              >
                <h4 className="text-2xl font-bold text-pink-300">Scalable</h4>
                <div className="text-lg font-semibold text-white">Growth Potential</div>
                <p className="text-sm text-slate-400">With creator onboarding and marketplace expansion</p>
              </motion.div>
            </div>
          </CardContent>
        </Web3Card>
      </motion.div>
    </div>
  )
}

function HowItWorksSlide() {
  return (
    <div className="space-y-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
      >
        How It Works
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Web3Card glowColor="purple">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Users className="w-5 h-5" />
                For Creators
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm relative">
                    1
                    <div className="absolute inset-0 bg-purple-400/30 rounded-full animate-ping" />
                  </div>
                  <span className="text-slate-300">Connect MetaMask wallet</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <span className="text-slate-300">Upload art/music or use 2D canvas</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <span className="text-slate-300">Set title, description, and price</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    4
                  </div>
                  <span className="text-slate-300">Mint NFT and sell in marketplace</span>
                </motion.div>
              </div>
            </CardContent>
          </Web3Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Web3Card glowColor="pink">
            <CardHeader>
              <CardTitle className="text-pink-400 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                For Buyers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-pink-500/10 border border-pink-500/20"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm relative">
                    1
                    <div className="absolute inset-0 bg-pink-400/30 rounded-full animate-ping" />
                  </div>
                  <span className="text-slate-300">Browse marketplace</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <span className="text-slate-300">Connect wallet</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <span className="text-slate-300">Purchase NFTs</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    4
                  </div>
                  <span className="text-slate-300">View NFTs in wallet</span>
                </motion.div>
              </div>
            </CardContent>
          </Web3Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Web3Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-2xl font-semibold text-green-400 flex items-center justify-center gap-2"
              >
                <Hexagon className="w-6 h-6" />
                Royalty Distribution
              </motion.h3>
              <div className="flex items-center justify-center gap-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 0.9, type: "spring" }}
                  className="text-center p-6 bg-green-500/10 rounded-2xl border border-green-500/20"
                >
                  <div className="text-5xl font-bold text-green-400 relative">
                    90%
                    <div className="absolute inset-0 bg-green-400/20 blur-xl rounded-full" />
                  </div>
                  <p className="text-slate-300 mt-2">To Creator</p>
                </motion.div>
                <div className="text-3xl text-slate-500">+</div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 1, type: "spring" }}
                  className="text-center p-6 bg-blue-500/10 rounded-2xl border border-blue-500/20"
                >
                  <div className="text-5xl font-bold text-blue-400 relative">
                    10%
                    <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full" />
                  </div>
                  <p className="text-slate-300 mt-2">To Platform</p>
                </motion.div>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="text-sm text-slate-400 flex items-center justify-center gap-2"
              >
                <Network className="w-4 h-4" />
                On every sale and resale
              </motion.p>
            </div>
          </CardContent>
        </Web3Card>
      </motion.div>
    </div>
  )
}

function TechStackSlide() {
  return (
    <div className="space-y-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
      >
        Technical Stack
      </motion.h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Blockchain",
            tech: "Lisk L2",
            desc: "Low-cost, scalable transactions",
            color: "blue",
            delay: 0.1,
            icon: Network,
          },
          {
            title: "Smart Contract",
            tech: "Solidity",
            desc: "OpenZeppelin for secure ERC721",
            color: "purple",
            delay: 0.2,
            icon: Shield,
          },
          {
            title: "Frontend",
            tech: "Next.js",
            desc: "Responsive, fast UI",
            color: "green",
            delay: 0.3,
            icon: Globe,
          },
          {
            title: "Wallet Integration",
            tech: ["RainbowKit", "WagmiJS"],
            desc: "Blockchain connectivity",
            color: "orange",
            delay: 0.4,
            icon: Cpu,
          },
          {
            title: "Storage",
            tech: "IPFS",
            desc: "Decentralized file/metadata hosting",
            color: "pink",
            delay: 0.5,
            icon: Hexagon,
          },
          {
            title: "Security",
            tech: "OpenZeppelin",
            desc: "Battle-tested smart contracts",
            color: "yellow",
            delay: 0.6,
            icon: Shield,
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: item.delay, duration: 0.5 }}
            whileHover={{
              y: -5,
              transition: { duration: 0.2 },
            }}
          >
            <Web3Card glowColor={item.color}>
              <CardHeader>
                <CardTitle className={`text-${item.color}-400 text-center flex items-center justify-center gap-2`}>
                  <item.icon className="w-5 h-5" />
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                {Array.isArray(item.tech) ? (
                  item.tech.map((t, i) => (
                    <div key={i} className="text-lg font-bold text-white">
                      {t}
                    </div>
                  ))
                ) : (
                  <div className="text-2xl font-bold text-white">{item.tech}</div>
                )}
                <p className="text-sm text-slate-300">{item.desc}</p>
              </CardContent>
            </Web3Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Web3Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-2xl font-semibold text-cyan-400 flex items-center justify-center gap-2"
              >
                <Cpu className="w-6 h-6" />
                Why This Stack?
              </motion.h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="space-y-2 p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20"
                >
                  <Network className="w-8 h-8 text-cyan-400 mx-auto" />
                  <div className="font-semibold text-white">Scalable</div>
                  <p className="text-slate-300">Lisk L2 handles high throughput</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="space-y-2 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20"
                >
                  <Shield className="w-8 h-8 text-blue-400 mx-auto" />
                  <div className="font-semibold text-white">Secure</div>
                  <p className="text-slate-300">OpenZeppelin standards</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="space-y-2 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20"
                >
                  <Globe className="w-8 h-8 text-purple-400 mx-auto" />
                  <div className="font-semibold text-white">User-Friendly</div>
                  <p className="text-slate-300">Modern React ecosystem</p>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Web3Card>
      </motion.div>
    </div>
  )
}

function CompetitiveSlide() {
  return (
    <div className="space-y-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent"
      >
        Competitive Advantage
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <Web3Card glowColor="green">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Higher Creator Payouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex justify-between items-center p-3 rounded-lg bg-green-500/20 border border-green-500/30"
                >
                  <span className="text-white font-semibold flex items-center gap-2">
                    <Hexagon className="w-4 h-4 text-green-400" />
                    Cr8or
                  </span>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">90% Royalties</Badge>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-between items-center p-3 rounded-lg bg-slate-700/30 border border-slate-600/30"
                >
                  <span className="text-slate-400">OpenSea</span>
                  <Badge variant="outline" className="text-slate-400 border-slate-500/30">
                    50-80%
                  </Badge>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-between items-center p-3 rounded-lg bg-slate-700/30 border border-slate-600/30"
                >
                  <span className="text-slate-400">Rarible</span>
                  <Badge variant="outline" className="text-slate-400 border-slate-500/30">
                    50-80%
                  </Badge>
                </motion.div>
              </div>
            </CardContent>
          </Web3Card>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Web3Card glowColor="blue">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Lower Costs
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                <p>
                  Lisk L2 reduces gas fees significantly compared to Ethereum-based platforms, making NFT creation
                  accessible to all creators.
                </p>
                <div className="mt-4 flex items-center gap-2 text-blue-300">
                  <Network className="w-4 h-4" />
                  <span className="text-sm">Low transaction costs</span>
                </div>
              </CardContent>
            </Web3Card>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <Web3Card glowColor="purple">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Ease of Use
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-300">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
              >
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Drag-and-drop minting</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20"
              >
                <Globe className="w-4 h-4 text-blue-400" />
                <span>2D canvas for instant creation</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-green-500/10 border border-green-500/20"
              >
                <Users className="w-4 h-4 text-green-400" />
                <span>Non-technical creator friendly</span>
              </motion.div>
            </CardContent>
          </Web3Card>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Web3Card glowColor="pink">
              <CardHeader>
                <CardTitle className="text-pink-400 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Creator-Centric
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                <p>
                  Tailored specifically for music and art creators, unlike generic NFT marketplaces that serve all use
                  cases.
                </p>
                <div className="mt-4 flex items-center gap-2 text-pink-300">
                  <Hexagon className="w-4 h-4" />
                  <span className="text-sm">Specialized platform</span>
                </div>
              </CardContent>
            </Web3Card>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Web3Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
          <CardHeader>
            <CardTitle className="text-indigo-400 text-center flex items-center justify-center gap-2">
              <Network className="w-5 h-5" />
              Competitive Matrix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cyan-500/20">
                    <th className="text-left py-3 text-slate-400">Platform</th>
                    <th className="text-center py-3 text-slate-400">Creator Royalties</th>
                    <th className="text-center py-3 text-slate-400">Gas Fees</th>
                    <th className="text-center py-3 text-slate-400">Ease of Use</th>
                    <th className="text-center py-3 text-slate-400">Creator Focus</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="border-b border-cyan-500/10 bg-cyan-500/5"
                  >
                    <td className="py-3 font-semibold text-white flex items-center gap-2">
                      <Hexagon className="w-4 h-4 text-cyan-400" />
                      Cr8or
                    </td>
                    <td className="text-center py-3">
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">90%</Badge>
                    </td>
                    <td className="text-center py-3">
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Low</Badge>
                    </td>
                    <td className="text-center py-3">
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">High</Badge>
                    </td>
                    <td className="text-center py-3">
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Music/Art</Badge>
                    </td>
                  </motion.tr>
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="border-b border-slate-700/20"
                  >
                    <td className="py-3">OpenSea</td>
                    <td className="text-center py-3">
                      <Badge variant="outline" className="text-slate-400 border-slate-500/30">
                        50-80%
                      </Badge>
                    </td>
                    <td className="text-center py-3">
                      <Badge variant="outline" className="text-slate-400 border-slate-500/30">
                        High
                      </Badge>
                    </td>
                    <td className="text-center py-3">
                      <Badge variant="outline" className="text-slate-400 border-slate-500/30">
                        Medium
                      </Badge>
                    </td>
                    <td className="text-center py-3">
                      <Badge variant="outline" className="text-slate-400 border-slate-500/30">
                        Generic
                      </Badge>
                    </td>
                  </motion.tr>
                  <motion.tr initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
                    <td className="py-3">Foundation</td>
                    <td className="text-center py-3">
                      <Badge variant="outline" className="text-slate-400 border-slate-500/30">
                        85%
                      </Badge>
                    </td>
                    <td className="text-center py-3">
                      <Badge variant="outline" className="text-slate-400 border-slate-500/30">
                        High
                      </Badge>
                    </td>
                    <td className="text-center py-3">
                      <Badge variant="outline" className="text-slate-400 border-slate-500/30">
                        Medium
                      </Badge>
                    </td>
                    <td className="text-center py-3">
                      <Badge variant="outline" className="text-slate-400 border-slate-500/30">
                        Art
                      </Badge>
                    </td>
                  </motion.tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Web3Card>
      </motion.div>
    </div>
  )
}

function TimelineSlide() {
  return (
    <div className="space-y-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
      >
        Timeline & Traction
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Web3Card glowColor="blue">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Phase 1: MVP (2 Weeks)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-300">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
              >
                <Clock className="w-4 h-4 text-yellow-400" />
                <span>Smart contract deployment</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20"
              >
                <Zap className="w-4 h-4 text-blue-400" />
                <span>Drag-and-drop minting UI</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-green-500/10 border border-green-500/20"
              >
                <Network className="w-4 h-4 text-green-400" />
                <span>Basic marketplace integration</span>
              </motion.div>
            </CardContent>
          </Web3Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Web3Card glowColor="purple">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Phase 2: Growth (Q3 2025)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-300">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-purple-500/10 border border-purple-500/20"
              >
                <Users className="w-4 h-4 text-purple-400" />
                <span>Creator onboarding campaigns</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20"
              >
                <Hexagon className="w-4 h-4 text-cyan-400" />
                <span>Community building initiatives</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-pink-500/10 border border-pink-500/20"
              >
                <Globe className="w-4 h-4 text-pink-400" />
                <span>Partnership development</span>
              </motion.div>
            </CardContent>
          </Web3Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Web3Card className="bg-gradient-to-r from-green-500/10 to-cyan-500/10">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-2xl font-semibold text-green-400 flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-6 h-6" />
                Current Traction
              </motion.h3>
              <div className="grid md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="p-4 bg-green-500/10 rounded-lg border border-green-500/20"
                >
                  <div className="flex items-center gap-2 text-green-300 mb-2">
                    <Hexagon className="w-4 h-4" />
                    <span className="font-semibold">MVP Live</span>
                  </div>
                  <p className="text-slate-300 text-sm">cr8or.vercel.app</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20"
                >
                  <div className="flex items-center gap-2 text-cyan-300 mb-2">
                    <Target className="w-4 h-4" />
                    <span className="font-semibold">Target</span>
                  </div>
                  <p className="text-slate-300 text-sm">5 test NFTs minted</p>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Web3Card>
      </motion.div>
    </div>
  )
}

function RisksSlide() {
  return (
    <div className="space-y-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent"
      >
        Risks & Mitigation
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Web3Card glowColor="red">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Smart Contract Bugs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-slate-300 text-sm">Risk: Vulnerabilities in smart contract code</p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-green-500/20 rounded-lg p-3 border border-green-500/30"
              >
                <p className="text-green-300 text-sm font-semibold flex items-center gap-2">
                  <Hexagon className="w-4 h-4" />
                  Mitigation:
                </p>
                <p className="text-green-200 text-sm">Use OpenZeppelin standards, plan for professional audits</p>
              </motion.div>
            </CardContent>
          </Web3Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Web3Card glowColor="orange">
            <CardHeader>
              <CardTitle className="text-orange-400 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Gas Fees
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-slate-300 text-sm">Risk: High transaction costs deterring users</p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-green-500/20 rounded-lg p-3 border border-green-500/30"
              >
                <p className="text-green-300 text-sm font-semibold flex items-center gap-2">
                  <Network className="w-4 h-4" />
                  Mitigation:
                </p>
                <p className="text-green-200 text-sm">Lisk L2 ensures affordable transactions</p>
              </motion.div>
            </CardContent>
          </Web3Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Web3Card glowColor="yellow">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                IPFS Reliability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-slate-300 text-sm">Risk: Content availability and permanence</p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-green-500/20 rounded-lg p-3 border border-green-500/30"
              >
                <p className="text-green-300 text-sm font-semibold flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  Mitigation:
                </p>
                <p className="text-green-200 text-sm">Partner with robust pinning services (e.g., Pinata)</p>
              </motion.div>
            </CardContent>
          </Web3Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Web3Card glowColor="purple">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Tight Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-slate-300 text-sm">Risk: Delivering MVP in 2-week sprint</p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-green-500/20 rounded-lg p-3 border border-green-500/30"
              >
                <p className="text-green-300 text-sm font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Mitigation:
                </p>
                <p className="text-green-200 text-sm">
                  Prioritize core features (minting, marketplace); defer non-essentials
                </p>
              </motion.div>
            </CardContent>
          </Web3Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Web3Card className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-2xl font-semibold text-blue-400 flex items-center justify-center gap-2"
              >
                <Shield className="w-6 h-6" />
                Risk Management Strategy
              </motion.h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="space-y-3 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20"
                >
                  <Shield className="w-8 h-8 text-blue-400 mx-auto" />
                  <div className="font-semibold text-white">Security First</div>
                  <p className="text-slate-300">Battle-tested libraries and audit planning</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="space-y-3 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20"
                >
                  <Zap className="w-8 h-8 text-yellow-400 mx-auto" />
                  <div className="font-semibold text-white">Agile Development</div>
                  <p className="text-slate-300">Iterative approach with core feature focus</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="space-y-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20"
                >
                  <Network className="w-8 h-8 text-green-400 mx-auto" />
                  <div className="font-semibold text-white">Infrastructure</div>
                  <p className="text-slate-300">Reliable partners and redundant systems</p>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Web3Card>
      </motion.div>
    </div>
  )
}

function TeamSlide() {
  return (
    <div className="space-y-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
      >
        Team
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Web3Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10">
          <CardHeader>
            <CardTitle className="text-purple-400 text-center text-2xl flex items-center justify-center gap-2">
              <Hexagon className="w-6 h-6" />
              Team 3
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="relative w-24 h-24 mx-auto"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full flex items-center justify-center relative">
                  <Users className="w-12 h-12 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-cyan-400/30 rounded-full animate-ping" />
                </div>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-slate-300 text-lg"
              >
                Skilled development team with expertise in Solidity, Next.js, and Web3 integrations
              </motion.p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center space-y-3 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20"
              >
                <div className="w-16 h-16 bg-blue-500/20 rounded-full mx-auto flex items-center justify-center relative">
                  <Shield className="w-8 h-8 text-blue-400" />
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-sm" />
                </div>
                <h4 className="font-semibold text-white">Blockchain</h4>
                <p className="text-sm text-slate-300">Solidity, Smart Contracts, Web3</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-center space-y-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full mx-auto flex items-center justify-center relative">
                  <Globe className="w-8 h-8 text-green-400" />
                  <div className="absolute inset-0 bg-green-400/20 rounded-full blur-sm" />
                </div>
                <h4 className="font-semibold text-white">Frontend</h4>
                <p className="text-sm text-slate-300">Next.js, React, TypeScript</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-center space-y-3 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20"
              >
                <div className="w-16 h-16 bg-purple-500/20 rounded-full mx-auto flex items-center justify-center relative">
                  <Network className="w-8 h-8 text-purple-400" />
                  <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-sm" />
                </div>
                <h4 className="font-semibold text-white">Integration</h4>
                <p className="text-sm text-slate-300">RainbowKit, WagmiJS, IPFS</p>
              </motion.div>
            </div>
          </CardContent>
        </Web3Card>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
          <Web3Card glowColor="pink">
            <CardHeader>
              <CardTitle className="text-pink-400 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-300">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                Passionate about creator empowerment and Web3 development
              </motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
                Building Cr8or as a portfolio project to showcase full-stack and blockchain expertise
              </motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                Committed to fair creator monetization in the digital economy
              </motion.p>
            </CardContent>
          </Web3Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
          <Web3Card glowColor="orange">
            <CardHeader>
              <CardTitle className="text-orange-400 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Seeking Advisors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-300">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-orange-500/10 border border-orange-500/20"
              >
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>Web3 and blockchain experts</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
              >
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Creator economy specialists</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20"
              >
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>NFT marketplace veterans</span>
              </motion.div>
            </CardContent>
          </Web3Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.3 }}
      >
        <Web3Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="text-2xl font-semibold text-indigo-400 flex items-center justify-center gap-2"
              >
                <Cpu className="w-6 h-6" />
                Why We're Building Cr8or
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-slate-300 max-w-3xl mx-auto"
              >
                We believe creators deserve fair compensation and true ownership of their work. Cr8or represents our
                commitment to building a more equitable creator economy through decentralized technology and
                user-centric design.
              </motion.p>
            </div>
          </CardContent>
        </Web3Card>
      </motion.div>
    </div>
  )
}

function AskSlide() {
  return (
    <div className="space-y-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"
      >
        The Ask
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Web3Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <motion.h3
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="relative"
              >
                <div className="text-5xl font-bold text-green-400 flex items-center justify-center gap-2">
                  <DollarSign className="w-12 h-12" />
                  $1M Seed Round
                </div>
                <div className="absolute inset-0 bg-green-400/20 blur-3xl rounded-full" />
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-slate-300 text-lg"
              >
                To accelerate Cr8or's growth and creator onboarding
              </motion.p>
            </div>
          </CardContent>
        </Web3Card>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Web3Card glowColor="blue">
            <CardHeader>
              <CardTitle className="text-blue-400 text-center flex items-center justify-center gap-2">
                <Cpu className="w-5 h-5" />
                50% Development
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-300 text-sm">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20"
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Smart contract audits</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20"
              >
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span>UI/UX polish and optimization</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-purple-500/10 border border-purple-500/20"
              >
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Mobile app development</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-green-500/10 border border-green-500/20"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Advanced creator tools</span>
              </motion.div>
            </CardContent>
          </Web3Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Web3Card glowColor="purple">
            <CardHeader>
              <CardTitle className="text-purple-400 text-center flex items-center justify-center gap-2">
                <TrendingUp className="w-5 h-5" />
                30% Marketing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-300 text-sm">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-purple-500/10 border border-purple-500/20"
              >
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Creator onboarding campaigns</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-pink-500/10 border border-pink-500/20"
              >
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span>Community growth initiatives</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-orange-500/10 border border-orange-500/20"
              >
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>Partnership development</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
              >
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Brand awareness campaigns</span>
              </motion.div>
            </CardContent>
          </Web3Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Web3Card glowColor="orange">
            <CardHeader>
              <CardTitle className="text-orange-400 text-center flex items-center justify-center gap-2">
                <Shield className="w-5 h-5" />
                20% Operations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-300 text-sm">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-orange-500/10 border border-orange-500/20"
              >
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>IPFS hosting and infrastructure</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20"
              >
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>Legal and compliance</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
              >
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Team expansion</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-green-500/10 border border-green-500/20"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Operational overhead</span>
              </motion.div>
            </CardContent>
          </Web3Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Web3Card className="bg-gradient-to-r from-pink-500/10 to-purple-500/10">
          <CardHeader>
            <CardTitle className="text-pink-400 text-center flex items-center justify-center gap-2">
              <Target className="w-5 h-5" />
              Key Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-4 p-4 bg-pink-500/10 rounded-lg border border-pink-500/20"
              >
                <h4 className="text-xl font-semibold text-pink-300 flex items-center gap-2">
                  <Hexagon className="w-5 h-5" />
                  Q3 2025 Target
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Creators Onboarded</span>
                    <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">500</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">NFTs Minted</span>
                    <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">2.5K</Badge>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="space-y-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20"
              >
                <h4 className="text-xl font-semibold text-purple-300 flex items-center gap-2">
                  <Network className="w-5 h-5" />
                  Q2 2026 Target
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Sales Volume</span>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">$1M</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Platform Revenue</span>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">$100K</Badge>
                  </div>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Web3Card>
      </motion.div>
    </div>
  )
}

function ClosingSlide() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Hexagon className="w-6 h-6 text-cyan-400/30" />
          </motion.div>
        ))}
      </div>

      <div className="text-center space-y-8 max-w-4xl relative z-10">
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="relative"
        >
          <div className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Why Cr8or?
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 blur-3xl" />
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 my-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Web3Card glowColor="green">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="relative">
                  <DollarSign className="w-12 h-12 text-green-400 mx-auto" />
                  <div className="absolute inset-0 bg-green-400/20 blur-xl rounded-full" />
                </div>
                <h3 className="text-xl font-semibold text-green-400">Fair Royalties</h3>
                <p className="text-slate-300">90% to creators with true ownership</p>
              </CardContent>
            </Web3Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Web3Card glowColor="blue">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="relative">
                  <TrendingUp className="w-12 h-12 text-blue-400 mx-auto" />
                  <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full" />
                </div>
                <h3 className="text-xl font-semibold text-blue-400">Huge Market</h3>
                <p className="text-slate-300">$100B NFT + $250B creator markets</p>
              </CardContent>
            </Web3Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Web3Card glowColor="purple">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="relative">
                  <Users className="w-12 h-12 text-purple-400 mx-auto" />
                  <div className="absolute inset-0 bg-purple-400/20 blur-xl rounded-full" />
                </div>
                <h3 className="text-xl font-semibold text-purple-400">Dedicated Team</h3>
                <p className="text-slate-300">Lean MVP, scalable tech, passionate builders</p>
              </CardContent>
            </Web3Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-3xl font-bold text-white"
          >
            Join us in revolutionizing creator monetization!
          </motion.h3>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 text-slate-300"
          >
            <motion.a
              href="mailto:email@example.com"
              className="flex items-center gap-2 hover:text-cyan-400 transition-colors border border-cyan-500/30 rounded-full px-4 py-2 backdrop-blur-sm"
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(34, 211, 238, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <DollarSign className="w-5 h-5" />
              email@example.com
            </motion.a>
            <motion.a
              href="https://cr8or.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-cyan-400 transition-colors border border-cyan-500/30 rounded-full px-4 py-2 backdrop-blur-sm"
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(34, 211, 238, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Globe className="w-5 h-5" />
              cr8or.vercel.app
            </motion.a>
            <motion.a
              href="https://twitter.com/Cr8orNFT"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-cyan-400 transition-colors border border-cyan-500/30 rounded-full px-4 py-2 backdrop-blur-sm"
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(34, 211, 238, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <TrendingUp className="w-5 h-5" />
              @Cr8orNFT
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: "spring" }}
          className="mt-12"
        >
          <div className="relative">
            <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-500/30 text-lg px-6 py-3">
              <Hexagon className="w-5 h-5 mr-2" />
              Create, Own, Earn.
            </Badge>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-xl rounded-full" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
