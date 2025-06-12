import React from "react";

// Primary Brand Logo Component
const PrimaryBrandLogo = ({ width = 200, height = 80, className = "" }) => {
  return (
    <div
      className={`flex items-center gap-4 ${className}`}
      style={{ width, height }}
    >
      <div className="relative" style={{ width: height, height: height }}>
        <svg className="w-full h-full" viewBox="0 0 80 80">
          <defs>
            <linearGradient
              id="purpleGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" style={{ stopColor: "#8b5cf6" }} />
              <stop offset="100%" style={{ stopColor: "#06b6d4" }} />
            </linearGradient>
          </defs>
          <path
            className="animate-pulse"
            d="M20 40 C20 25, 35 25, 40 40 C45 55, 60 55, 60 40 C60 25, 45 25, 40 40 C35 55, 20 55, 20 40 Z"
            stroke="url(#purpleGradient)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            style={{
              filter: "drop-shadow(0 0 20px rgba(139, 92, 246, 0.6))",
              animation: "glow 2s ease-in-out infinite alternate",
            }}
          />
        </svg>

        {/* Blockchain Nodes */}
        <div className="absolute inset-0">
          <div
            className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg animate-pulse"
            style={{
              top: "20%",
              left: "25%",
              boxShadow: "0 0 10px #06b6d4",
              animationDelay: "0.2s",
            }}
          />
          <div
            className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg animate-pulse"
            style={{
              top: "20%",
              right: "25%",
              boxShadow: "0 0 10px #06b6d4",
              animationDelay: "0.4s",
            }}
          />
          <div
            className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg animate-pulse"
            style={{
              bottom: "20%",
              left: "25%",
              boxShadow: "0 0 10px #06b6d4",
              animationDelay: "0.6s",
            }}
          />
          <div
            className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg animate-pulse"
            style={{
              bottom: "20%",
              right: "25%",
              boxShadow: "0 0 10px #06b6d4",
              animationDelay: "0.8s",
            }}
          />
        </div>

        {/* Creative Brush */}
        <div
          className="absolute w-5 h-5 rounded-full opacity-70 animate-bounce"
          style={{
            top: "-10px",
            right: "-10px",
            background: "linear-gradient(45deg, #f59e0b, #ef4444)",
            borderRadius: "50% 0",
            transform: "rotate(45deg)",
          }}
        />
      </div>

      <div
        className="font-black flex items-center text-4xl tracking-tight"
        style={{
          background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 0 20px rgba(139, 92, 246, 0.4))",
        }}
      >
        <span>CR</span>
        <span className="text-5xl font-black tracking-tight bg-gradient-to-r from-gray-300 via-gray-700 bg-clip-text text-transparent transform -rotate-12 inline-block relative">
          8
        </span>
        <span>OR</span>
      </div>
    </div>
  );
};

// Icon Mark Component
const IconMark = ({ size = 100, className = "" }) => {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg className="w-full h-full" viewBox="0 0 80 80">
        <defs>
          <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#8b5cf6" }} />
            <stop offset="100%" style={{ stopColor: "#06b6d4" }} />
          </linearGradient>
        </defs>
        <path
          className="animate-pulse"
          d="M20 40 C20 25, 35 25, 40 40 C45 55, 60 55, 60 40 C60 25, 45 25, 40 40 C35 55, 20 55, 20 40 Z"
          stroke="url(#iconGradient)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          style={{
            filter: "drop-shadow(0 0 20px rgba(139, 92, 246, 0.6))",
            animation: "glow 2s ease-in-out infinite alternate",
          }}
        />
      </svg>

      {/* Blockchain Nodes */}
      <div className="absolute inset-0">
        <div
          className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg animate-pulse"
          style={{
            top: "20%",
            left: "25%",
            boxShadow: "0 0 10px #06b6d4",
            animationDelay: "0.2s",
          }}
        />
        <div
          className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg animate-pulse"
          style={{
            top: "20%",
            right: "25%",
            boxShadow: "0 0 10px #06b6d4",
            animationDelay: "0.4s",
          }}
        />
        <div
          className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg animate-pulse"
          style={{
            bottom: "20%",
            left: "25%",
            boxShadow: "0 0 10px #06b6d4",
            animationDelay: "0.6s",
          }}
        />
        <div
          className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg animate-pulse"
          style={{
            bottom: "20%",
            right: "25%",
            boxShadow: "0 0 10px #06b6d4",
            animationDelay: "0.8s",
          }}
        />
      </div>

      {/* Creative Brush */}
      <div
        className="absolute w-5 h-5 rounded-full opacity-70 animate-bounce"
        style={{
          top: "-10px",
          right: "-10px",
          background: "linear-gradient(45deg, #f59e0b, #ef4444)",
          borderRadius: "50% 0",
          transform: "rotate(45deg)",
        }}
      />
    </div>
  );
};

// Wordmark Component
const Wordmark = ({ size = 48, className = "" }) => {
  return (
    <div
      className={`font-black tracking-tight ${className}`}
      style={{
        fontSize: `${size}px`,
        background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        filter: "drop-shadow(0 0 20px rgba(139, 92, 246, 0.4))",
      }}
    >
      CR
      <span
        style={{
          fontSize: `${size + 11}px`,
        }}
        className=" font-black tracking-tight bg-gradient-to-r from-gray-300 via-gray-700 bg-clip-text text-transparent transform -rotate-12 inline-block relative"
      >
        8
      </span>
      OR
    </div>
  );
};

// Demo Component to showcase all logos
const Cr8orBranding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            CR8OR Logo Components
          </h1>
          <p className="text-gray-300">
            Modern, Scalable React/Next.js Logo Components
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Primary Brand Logo */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:transform hover:-translate-y-2 transition-all duration-300">
            <h3 className="text-purple-400 text-xl font-semibold mb-6 text-center">
              Primary Brand Logo
            </h3>
            <div className="flex justify-center items-center min-h-[120px]">
              <PrimaryBrandLogo width={280} height={80} />
            </div>
            <div className="mt-4 text-sm text-gray-400 text-center">
              Full logo with icon and text
            </div>
          </div>

          {/* Icon Mark */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:transform hover:-translate-y-2 transition-all duration-300">
            <h3 className="text-purple-400 text-xl font-semibold mb-6 text-center">
              Icon Mark
            </h3>
            <div className="flex justify-center items-center min-h-[120px]">
              <IconMark size={100} />
            </div>
            <div className="mt-4 text-sm text-gray-400 text-center">
              Standalone icon for favicons, avatars
            </div>
          </div>

          {/* Wordmark */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:transform hover:-translate-y-2 transition-all duration-300">
            <h3 className="text-purple-400 text-xl font-semibold mb-6 text-center">
              Wordmark
            </h3>
            <div className="flex justify-center items-center min-h-[120px]">
              <Wordmark size={48} />
            </div>
            <div className="mt-4 text-sm text-gray-400 text-center">
              Text-only version for headers
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-12 bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <h3 className="text-purple-400 text-2xl font-semibold mb-6 text-center">
            Usage Examples
          </h3>
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="text-center">
                <div className="mb-2">
                  <IconMark size={32} />
                </div>
                <span className="text-xs text-gray-400">32px (Favicon)</span>
              </div>
              <div className="text-center">
                <div className="mb-2">
                  <IconMark size={48} />
                </div>
                <span className="text-xs text-gray-400">48px (Avatar)</span>
              </div>
              <div className="text-center">
                <div className="mb-2">
                  <Wordmark size={24} />
                </div>
                <span className="text-xs text-gray-400">24px (Nav)</span>
              </div>
              <div className="text-center">
                <div className="mb-2">
                  <PrimaryBrandLogo width={200} height={60} />
                </div>
                <span className="text-xs text-gray-400">200px (Header)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Component Props */}
        <div className="mt-8 bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <h3 className="text-purple-400 text-xl font-semibold mb-4">
            Component Props
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="text-cyan-400 font-semibold mb-2">
                PrimaryBrandLogo
              </h4>
              <ul className="text-gray-300 space-y-1">
                <li>• width: number (200)</li>
                <li>• height: number (80)</li>
                <li>• className: string ("")</li>
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-400 font-semibold mb-2">IconMark</h4>
              <ul className="text-gray-300 space-y-1">
                <li>• size: number (100)</li>
                <li>• className: string ("")</li>
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-400 font-semibold mb-2">Wordmark</h4>
              <ul className="text-gray-300 space-y-1">
                <li>• size: number (48)</li>
                <li>• className: string ("")</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes glow {
          0% {
            filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.6));
          }
          100% {
            filter: drop-shadow(0 0 30px rgba(139, 92, 246, 0.9));
          }
        }
      `}</style>
    </div>
  );
};

export default Cr8orBranding;

// Export individual components for use in other files
export { PrimaryBrandLogo, IconMark, Wordmark };
