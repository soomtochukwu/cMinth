"use client";

import { AnimatedBackground } from "@/components/animated-background";
import { CanvasDrawing } from "@maziofweb3/minth-canvas";
import "tailwindcss/tailwind.css";

export default function CanvasPage() {
  const handleImageGenerated = (file: File, url: string) => {
    console.log("Image generated:", file, url);

    // Display the image
    const img = new Image();
    img.src = url;
    img.alt = "Generated image";
    img.style.maxWidth = "100%";
    // document.body.appendChild(img);

    // Prompt for file name
    const filename = prompt("Enter Image Name") || "ArtBy-MinthCanvas";

    // Create download link
    const link = document.createElement("a");
    link.href = url; // use the data URL or blob URL
    link.download = `${filename}.png`;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-screen - mt-20">
      <AnimatedBackground />
      <div className="inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm animate-fadeIn overflow-auto pt-10">
        <CanvasDrawing
          onImageGenerated={handleImageGenerated}
          // @ts-ignore
          initialWidth={800}
          initialHeight={600}
          initialBackground="white"
          initialTool="brush"
          initialColor="#00f5ff"
          initialBrushSize={10}
        />
      </div>
    </div>
  );
}
