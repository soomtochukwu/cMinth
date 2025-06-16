"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  File,
  ImageIcon,
  Music,
  X,
  CheckCircle,
  PenTool,
} from "lucide-react";
import toast from "react-hot-toast";
import { CanvasDrawing } from "@maziofweb3/minth-canvas";
import Modal from "./modal";

interface FileUploadProps {
  onFilesUploaded: (files: { main?: File; artwork?: File }) => void;
}

export function FileUpload({ onFilesUploaded }: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<{
      main?: File;
      artwork?: File;
    }>({}),
    [open, setOpen] = useState(false),
    [uploadProgress, setUploadProgress] = useState<{
      [key: string]: number;
    }>({}),
    [isUploading, setIsUploading] = useState(false),
    simulateUpload = async (file: File, type: "main" | "artwork") => {
      setIsUploading(true);
      const fileKey = `${type}-${file.name}`;

      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress((prev) => ({ ...prev, [fileKey]: progress }));
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      setUploadedFiles((prev) => {
        const newFiles = { ...prev, [type]: file };
        // Use setTimeout to defer the callback to avoid setState during render
        setTimeout(() => {
          onFilesUploaded(newFiles);
        }, 0);
        return newFiles;
      });

      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[fileKey];
        return newProgress;
      });

      setIsUploading(false);
      toast.success(
        `${type === "main" ? "Main file" : "Artwork"} uploaded successfully!`
      );
    },
    onDropMain = useCallback((acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        simulateUpload(file, "main");
      }
    }, []),
    onDropArtwork = useCallback((acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        simulateUpload(file, "artwork");
      }
    }, []),
    {
      getRootProps: getMainRootProps,
      getInputProps: getMainInputProps,
      isDragActive: isMainDragActive,
    } = useDropzone({
      onDrop: onDropMain,
      accept: {
        "audio/*": [".mp3", ".wav", ".flac"],
        "image/*": [".jpg", ".jpeg", ".png", ".gif"],
        "video/*": [".mp4", ".mov"],
      },
      maxFiles: 1,
      disabled: isUploading,
    }),
    {
      getRootProps: getArtworkRootProps,
      getInputProps: getArtworkInputProps,
      isDragActive: isArtworkDragActive,
    } = useDropzone({
      onDrop: onDropArtwork,
      accept: {
        "image/*": [".jpg", ".jpeg", ".png", ".gif"],
      },
      maxFiles: 1,
      disabled: isUploading,
    }),
    removeFile = (type: "main" | "artwork") => {
      setUploadedFiles((prev) => {
        const newFiles = { ...prev };
        delete newFiles[type];
        // Use setTimeout to defer the callback to avoid setState during render
        setTimeout(() => {
          onFilesUploaded(newFiles);
        }, 0);
        return newFiles;
      });
    },
    handleImageGenerated = (file: File, url: string) => {
      setOpen(false);
      console.log("Image generated:", file, url);
      simulateUpload(file, "artwork").then(() => {
        simulateUpload(file, "main");
      });
      // Example: Display the image
      // (document.getElementById("coverArt") as HTMLImageElement).src = url;
    },
    getFileIcon = (file: File) => {
      if (file.type.startsWith("audio/"))
        return <Music className="w-8 h-8 text-purple-400" />;
      if (file.type.startsWith("image/"))
        return <ImageIcon className="w-8 h-8 text-cyan-400" />;
      return <File className="w-8 h-8 text-slate-400" />;
    };

  return (
    <div className="space-y-6">
      {/* Artwork Upload */}
      <div>
        <div className="text-lg font-semibold mb-3 flex flex-col text-white">
          1. Cover Artwork
          <span className="text-xs font-normal text-slate-400">
            ...preferably a thumbnail of the content
          </span>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Card
            className={`
            border-2 border-dashed transition-all duration-300 cursor-pointer
            ${
              isArtworkDragActive
                ? "border-cyan-500 bg-cyan-500/10"
                : uploadedFiles.artwork
                ? "border-emerald-500 bg-emerald-500/10"
                : "border-slate-600 bg-slate-800/20 hover:border-cyan-500/50 hover:bg-cyan-500/5"
            }
          `}
          >
            <CardContent {...getArtworkRootProps()} className="p-6">
              <input {...getArtworkInputProps()} />
              <AnimatePresence mode="wait">
                {uploadedFiles.artwork ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center"
                  >
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden">
                        <img
                          src={
                            URL.createObjectURL(uploadedFiles.artwork) ||
                            "/placeholder.svg"
                          }
                          id="coverArt"
                          alt="Artwork preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {uploadedFiles.artwork.name}
                    </h4>
                    <p className="text-slate-400 mb-4">
                      {(uploadedFiles.artwork.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">
                        Uploaded successfully
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile("artwork");
                      }}
                      className="mt-4 text-red-400 border-red-400 hover:bg-red-400/10"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center"
                  >
                    <ImageIcon className="w-10 h-10 mx-auto mb-3 text-cyan-400" />
                    <h4 className="text-base font-semibold text-white mb-2">
                      {isArtworkDragActive
                        ? "Drop artwork here"
                        : "Add cover artwork"}
                    </h4>
                    <p className="text-slate-400 text-sm">
                      Upload an image to use as your NFT's cover
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      {/* Main File Upload */}
      <h3 className="text-lg font-semibold mb-3 text-white">
        2. Main Content *
      </h3>{" "}
      <div className="flex max-md:flex-col max-md:grid-flow-col  gap-6 ">
        {/* upload */}
        <div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card
              className={`
            border-2 border-dashed transition-all duration-300 cursor-pointer
            ${
              isMainDragActive
                ? "border-purple-500 bg-purple-500/10"
                : uploadedFiles.main
                ? "border-emerald-500 bg-emerald-500/10"
                : "border-slate-600 bg-slate-800/20 hover:border-purple-500/50 hover:bg-purple-500/5"
            }
          `}
            >
              <CardContent {...getMainRootProps()} className="p-8">
                <input {...getMainInputProps()} />
                <AnimatePresence mode="wait">
                  {uploadedFiles.main ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-center"
                    >
                      <div className="flex items-center justify-center mb-4">
                        {getFileIcon(uploadedFiles.main)}
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {uploadedFiles.main.name}
                      </h4>
                      <p className="text-slate-400 mb-4">
                        {(uploadedFiles.main.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">
                          Uploaded successfully
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile("main");
                        }}
                        className="mt-4 text-red-400 border-red-400 hover:bg-red-400/10"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-center"
                    >
                      <Upload className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {isMainDragActive
                          ? "Drop your file here"
                          : "Upload your content"}
                      </h4>
                      <p className="text-slate-400 mb-4">
                        Drag and drop your audio, image, or video file here, or
                        click to browse
                      </p>
                      <p className="text-sm text-slate-500">
                        Supports: MP3, WAV, FLAC, JPG, PNG, GIF, MP4, MOV (Max
                        100MB)
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {Object.entries(uploadProgress).map(([fileKey, progress]) => (
                  <motion.div
                    key={fileKey}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">
                        Uploading...
                      </span>
                      <span className="text-sm text-purple-400">
                        {progress}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
        {/* on-the-go */}
        <div
          onClick={() => setOpen(true)}
          className="h-inherit py-7 hover:scale-[1.02] hover:bg-[#a5a5a50d] hover:border-[#ffffff80] w-full flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300 cursor-pointer border-slate-600 rounded-md "
        >
          <div className="w-12 h-12 mx-auto mb-4 text-slate-300">
            <PenTool size={45} />
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">
            On The Go{" "}
            <span
              className="text-purple-600"
              style={{
                fontSize: "10px",
              }}
            >
              [Beta]
            </span>
          </h4>
          <p className="text-slate-500 text-sm mb-4 text-center ">
            Click to draw with our canvas
          </p>
          <Modal isOpen={open} onClose={() => setOpen(false)}>
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
          </Modal>
        </div>
      </div>
    </div>
  );
}
