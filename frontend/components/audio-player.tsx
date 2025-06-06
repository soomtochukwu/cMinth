"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

interface AudioPlayerProps {
  src: string;
  title: string;
}

export function AudioPlayer({ src, title }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleError = (e: ErrorEvent) => {
      console.error("Audio error:", e);
      setHasError(true);
      setIsPlaying(false);
      toast.error("Unable to play audio: Source not available");
    };
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError as EventListener);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError as EventListener);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || hasError) return;

    if (isPlaying) {
      audio.pause();
    } else {
      // Wrap in try/catch to handle any playback errors
      try {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Playback started successfully
            })
            .catch((error) => {
              console.error("Playback error:", error);
              setHasError(true);
              toast.error(
                "Unable to play audio: " + (error.message || "Unknown error")
              );
            });
        }
      } catch (error) {
        console.error("Play error:", error);
        setHasError(true);
        toast.error("Unable to play audio");
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio || hasError) return;

    const newTime = value[0];
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio || hasError) return;

    const newVolume = value[0];
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio || hasError) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (hasError) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-amber-400" />
        <h3 className="text-lg font-semibold text-white mb-2">
          Audio Unavailable
        </h3>
        <p className="text-slate-400">
          This audio content is currently unavailable. The creator may need to
          upload the file.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Waveform Visualization */}
      <div className="mb-6">
        <div className="h-20 bg-slate-700/50 rounded-lg flex items-end justify-center gap-1 p-2">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="bg-gradient-to-t from-purple-500 to-cyan-500 rounded-full"
              style={{
                width: "2px",
                height: `${Math.random() * 60 + 10}%`,
                opacity: currentTime / duration > i / 50 ? 1 : 0.3,
              }}
              animate={{
                height: isPlaying
                  ? `${Math.random() * 60 + 10}%`
                  : `${Math.random() * 60 + 10}%`,
              }}
              transition={{
                duration: 0.5,
                repeat: isPlaying ? Number.POSITIVE_INFINITY : 0,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={1}
          onValueChange={handleSeek}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-slate-400 mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="p-2">
            <SkipBack className="w-4 h-4" />
          </Button>

          <Button
            onClick={togglePlay}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 p-3"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </Button>

          <Button variant="outline" size="sm" className="p-2">
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMute}
            className="p-2"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>

          <div className="w-20">
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-slate-300 font-medium">{title}</p>
      </div>
    </div>
  );
}
