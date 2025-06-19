import React, { useEffect, useRef, useState } from "react";

interface CanvasBackgroundAnimationProps {
  svgElements?: string[];
  showTrails?: boolean;
  showConnections?: boolean;
  particleCount?: number;
  animationSpeed?: number;
  trailLength?: number;
  connectionDistance?: number;
  backgroundColor?: string;
  trailColor?: string;
  connectionColor?: string;
  className?: string;
}

interface Dimensions {
  width: number;
  height: number;
}

interface TrailPoint {
  x: number;
  y: number;
}

const CanvasBackgroundAnimation: React.FC<CanvasBackgroundAnimationProps> = ({
  svgElements = [],
  showTrails = false,
  showConnections = false,
  particleCount = 50,
  animationSpeed = 1,
  trailLength = 20,
  connectionDistance = 100,
  backgroundColor = "transparent",
  trailColor = "rgba(255, 255, 255, 0.1)",
  connectionColor = "rgba(255, 255, 255, 0.2)",
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const trailsRef = useRef<TrailPoint[][]>([]);
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });

  // Particle class
  class Particle {
    canvas: HTMLCanvasElement;
    svgElement: string;
    size: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    index: number;
    image: HTMLImageElement;
    imageLoaded: boolean;

    constructor(canvas: HTMLCanvasElement, svgElement: string, index: number) {
      this.canvas = canvas;
      this.svgElement = svgElement;
      this.size = Math.random() * 20 + 10;
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * animationSpeed;
      this.vy = (Math.random() - 0.5) * animationSpeed;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      this.opacity = Math.random() * 0.8 + 0.2;
      this.index = index;

      // Create image from SVG
      this.image = new Image();
      this.imageLoaded = false;
      this.loadSVGImage();
    }

    loadSVGImage(): void {
      const svgBlob = new Blob([this.svgElement], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);

      this.image.onload = () => {
        this.imageLoaded = true;
        URL.revokeObjectURL(url);
      };

      this.image.src = url;
    }

    update(): void {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;

      // Bounce off edges
      if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;

      // Keep within bounds
      this.x = Math.max(0, Math.min(this.canvas.width, this.x));
      this.y = Math.max(0, Math.min(this.canvas.height, this.y));

      // Update trails
      if (showTrails) {
        if (!trailsRef.current[this.index]) {
          trailsRef.current[this.index] = [];
        }

        trailsRef.current[this.index].push({ x: this.x, y: this.y });

        if (trailsRef.current[this.index].length > trailLength) {
          trailsRef.current[this.index].shift();
        }
      }
    }

    draw(ctx: CanvasRenderingContext2D): void {
      if (!this.imageLoaded) return;

      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      const drawSize = this.size;
      ctx.drawImage(
        this.image,
        -drawSize / 2,
        -drawSize / 2,
        drawSize,
        drawSize
      );

      ctx.restore();
    }
  }

  // Initialize particles
  const initParticles = (canvas: HTMLCanvasElement): void => {
    particlesRef.current = [];
    trailsRef.current = [];

    const elementsToUse =
      svgElements.length > 0 ? svgElements : [getDefaultSVG()];
    const particlesPerElement = Math.ceil(particleCount / elementsToUse.length);

    elementsToUse.forEach((svgElement) => {
      for (
        let i = 0;
        i < particlesPerElement && particlesRef.current.length < particleCount;
        i++
      ) {
        const particleIndex = particlesRef.current.length;
        particlesRef.current.push(
          new Particle(canvas, svgElement, particleIndex)
        );
      }
    });
  };

  // Default SVG if none provided
  const getDefaultSVG = (): string => {
    return `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8" fill="rgba(100, 150, 255, 0.7)" stroke="rgba(255, 255, 255, 0.5)" stroke-width="1"/>
    </svg>`;
  };

  // Draw trails
  const drawTrails = (ctx: CanvasRenderingContext2D): void => {
    if (!showTrails) return;

    ctx.strokeStyle = trailColor;
    ctx.lineWidth = 1;

    trailsRef.current.forEach((trail) => {
      if (!trail || trail.length < 2) return;

      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);

      for (let i = 1; i < trail.length; i++) {
        ctx.globalAlpha = (i / trail.length) * 0.5;
        ctx.lineTo(trail[i].x, trail[i].y);
      }

      ctx.stroke();
    });

    ctx.globalAlpha = 1;
  };

  // Draw connections
  const drawConnections = (ctx: CanvasRenderingContext2D): void => {
    if (!showConnections) return;

    ctx.strokeStyle = connectionColor;
    ctx.lineWidth = 1;

    for (let i = 0; i < particlesRef.current.length; i++) {
      for (let j = i + 1; j < particlesRef.current.length; j++) {
        const particle1 = particlesRef.current[i];
        const particle2 = particlesRef.current[j];

        const dx = particle1.x - particle2.x;
        const dy = particle1.y - particle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          ctx.globalAlpha = (1 - distance / connectionDistance) * 0.3;
          ctx.beginPath();
          ctx.moveTo(particle1.x, particle1.y);
          ctx.lineTo(particle2.x, particle2.y);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;
  };

  // Animation loop
  const animate = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw trails first (behind particles)
    drawTrails(ctx);

    // Update and draw particles
    particlesRef.current.forEach((particle) => {
      particle.update();
      particle.draw(ctx);
    });

    // Draw connections last (on top)
    drawConnections(ctx);

    animationRef.current = requestAnimationFrame(animate);
  };

  // Handle resize
  const handleResize = (): void => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  // Setup and cleanup
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    initParticles(canvas);
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    dimensions,
    svgElements,
    particleCount,
    animationSpeed,
    showTrails,
    showConnections,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 pointer-events-none -z-10 ${className}`}
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: backgroundColor,
      }}
    />
  );
};

// Sample SVG elements for you to use
export const sampleSvgElements: string[] = [
  // Glowing Star
  `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
          fill="rgba(255, 215, 0, 0.9)" 
          stroke="rgba(255, 255, 255, 0.8)" 
          stroke-width="1" 
          filter="url(#glow)"/>
  </svg>`,

  // Gradient Heart
  `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:rgba(255,100,150,0.9);stop-opacity:1" />
        <stop offset="100%" style="stop-color:rgba(255,50,100,0.9);stop-opacity:1" />
      </linearGradient>
    </defs>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
          fill="url(#heartGradient)" 
          stroke="rgba(255, 255, 255, 0.7)" 
          stroke-width="1"/>
  </svg>`,

  // Crystalline Diamond
  `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:rgba(100,255,200,0.9);stop-opacity:1" />
        <stop offset="50%" style="stop-color:rgba(150,255,255,0.9);stop-opacity:1" />
        <stop offset="100%" style="stop-color:rgba(100,200,255,0.9);stop-opacity:1" />
      </linearGradient>
    </defs>
    <path d="M6 3h12l4 6-10 12L2 9l4-6z" 
          fill="url(#diamondGradient)" 
          stroke="rgba(255, 255, 255, 0.8)" 
          stroke-width="1.5"/>
    <path d="M6 3h12l4 6H2l4-6z" 
          fill="rgba(255, 255, 255, 0.3)"/>
  </svg>`,

  // Neon Triangle
  `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="neonGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:rgba(150,100,255,0.9);stop-opacity:1" />
        <stop offset="100%" style="stop-color:rgba(255,100,255,0.9);stop-opacity:1" />
      </linearGradient>
    </defs>
    <path d="M12 2l10 18H2L12 2z" 
          fill="url(#triangleGradient)" 
          stroke="rgba(255, 255, 255, 0.9)" 
          stroke-width="1.5" 
          filter="url(#neonGlow)"/>
  </svg>`,

  // Hexagon with Pattern
  `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="hexPattern" patternUnits="userSpaceOnUse" width="4" height="4">
        <rect width="4" height="4" fill="rgba(100,150,255,0.3)"/>
        <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.6)"/>
      </pattern>
    </defs>
    <polygon points="12,2 20.5,7 20.5,17 12,22 3.5,17 3.5,7" 
             fill="url(#hexPattern)" 
             stroke="rgba(100,150,255,0.9)" 
             stroke-width="2"/>
  </svg>`,

  // Lightning Bolt
  `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lightningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:rgba(255,255,100,0.9);stop-opacity:1" />
        <stop offset="100%" style="stop-color:rgba(255,200,0,0.9);stop-opacity:1" />
      </linearGradient>
    </defs>
    <path d="M13 2L4.09 12.97A1 1 0 0 0 5 14.5h4.5l-1.5 7.5 8.91-10.97A1 1 0 0 0 16 9.5h-4.5L13 2z" 
          fill="url(#lightningGradient)" 
          stroke="rgba(255, 255, 255, 0.8)" 
          stroke-width="1"/>
  </svg>`,

  // Flower
  `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="flowerGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style="stop-color:rgba(255,200,200,0.9);stop-opacity:1" />
        <stop offset="100%" style="stop-color:rgba(255,100,150,0.9);stop-opacity:1" />
      </radialGradient>
    </defs>
    <g transform="translate(12,12)">
      <circle cx="0" cy="-8" r="3" fill="url(#flowerGradient)"/>
      <circle cx="6" cy="-4" r="3" fill="url(#flowerGradient)"/>
      <circle cx="6" cy="4" r="3" fill="url(#flowerGradient)"/>
      <circle cx="0" cy="8" r="3" fill="url(#flowerGradient)"/>
      <circle cx="-6" cy="4" r="3" fill="url(#flowerGradient)"/>
      <circle cx="-6" cy="-4" r="3" fill="url(#flowerGradient)"/>
      <circle cx="0" cy="0" r="2" fill="rgba(255,255,100,0.9)"/>
    </g>
  </svg>`,

  // Spiral Galaxy
  `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="galaxyGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style="stop-color:rgba(255,255,255,0.9);stop-opacity:1" />
        <stop offset="30%" style="stop-color:rgba(150,200,255,0.8);stop-opacity:1" />
        <stop offset="100%" style="stop-color:rgba(100,100,255,0.6);stop-opacity:1" />
      </radialGradient>
    </defs>
    <g transform="translate(12,12)">
      <path d="M0,0 Q-8,-4 -6,2 Q-2,8 4,6 Q10,2 8,-4 Q4,-10 -2,-8 Q-8,-4 -6,2" 
            fill="none" 
            stroke="url(#galaxyGradient)" 
            stroke-width="2"/>
      <circle cx="0" cy="0" r="1.5" fill="rgba(255,255,255,0.9)"/>
    </g>
  </svg>`,
];

// Example usage component for testing
interface ExampleConfig {
  showTrails: boolean;
  showConnections: boolean;
  particleCount: number;
  animationSpeed: number;
}

const ExampleUsage: React.FC = () => {
  const [config, setConfig] = useState<ExampleConfig>({
    showTrails: false,
    showConnections: false,
    particleCount: 30,
    animationSpeed: 1,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <CanvasBackgroundAnimation
        svgElements={sampleSvgElements}
        showTrails={config.showTrails}
        showConnections={config.showConnections}
        particleCount={config.particleCount}
        animationSpeed={config.animationSpeed}
        trailLength={15}
        connectionDistance={120}
        trailColor="rgba(255, 255, 255, 0.2)"
        connectionColor="rgba(100, 200, 255, 0.3)"
      />

      {/* Demo content */}
      <div className="relative z-10 p-8">
        <div className="max-w-2xl mx-auto bg-black/20 backdrop-blur-sm rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-6">
            Canvas Background Animation
          </h1>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.showTrails}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      showTrails: e.target.checked,
                    }))
                  }
                  className="rounded"
                />
                <span>Show Trails</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.showConnections}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      showConnections: e.target.checked,
                    }))
                  }
                  className="rounded"
                />
                <span>Show Connections</span>
              </label>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <span>Particles:</span>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={config.particleCount}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      particleCount: parseInt(e.target.value),
                    }))
                  }
                  className="w-20"
                />
                <span>{config.particleCount}</span>
              </label>

              <label className="flex items-center space-x-2">
                <span>Speed:</span>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={config.animationSpeed}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      animationSpeed: parseFloat(e.target.value),
                    }))
                  }
                  className="w-20"
                />
                <span>{config.animationSpeed}x</span>
              </label>
            </div>
          </div>

          <p className="mt-6 text-gray-300">
            This component creates an animated background with your SVG
            elements. It's positioned behind all content and responsive to all
            screen sizes. Try toggling the options above to see different
            effects!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CanvasBackgroundAnimation;
