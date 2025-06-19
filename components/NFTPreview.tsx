"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface NFTPreviewProps {
  imageUrl: string | null;
}

export default function NFTPreview({ imageUrl }: NFTPreviewProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (imageUrl) {
      setIsLoading(true);
    }
  }, [imageUrl]);

  return (
    <div className="w-full lg:w-1/2">
      <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gray-800/50 shadow-lg shadow-cyan-500/10 p-6 h-[500px] flex flex-col">
        <h2 className="text-xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-purple-600 text-transparent bg-clip-text">
          NFT Preview
        </h2>

        <div className="flex-grow flex items-center justify-center relative overflow-hidden rounded-lg bg-black/50">
          {/* Grid background for empty state */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>

          {!imageUrl ? (
            <div className="text-center p-8">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">
                Your NFT preview will appear here
              </p>
              <p className="text-gray-600 text-xs mt-2">
                Upload or draw an image to see a preview
              </p>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-t-cyan-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-sm text-gray-300">
                      Loading preview...
                    </p>
                  </div>
                </div>
              )}

              <div className="relative max-w-full max-h-full p-4">
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt="NFT Preview"
                  width={400}
                  height={400}
                  className="max-w-full max-h-[380px] object-contain rounded shadow-lg shadow-cyan-500/10"
                  onLoad={() => setIsLoading(false)}
                  onError={() => setIsLoading(false)}
                />

                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg blur-lg -z-10"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
