"use client";

import { Pause, Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import MarkdownRenderer from "./markdown-renderer";

interface SongSectionProps {
  audioPath: string;
  coverArt: string;
  title: string;
  artist: string;
  content: string;
  theme: "light" | "dark";
}

const SongSection = ({
  audioPath,
  coverArt,
  title,
  artist,
  content,
  theme,
}: SongSectionProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = new Audio(audioPath);
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [audioPath]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const time = (parseFloat(e.target.value) / 100) * duration;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
    setProgress(parseFloat(e.target.value));
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const isDark = theme === "dark";

  return (
    <div className="space-y-8">
      {/* Player Card */}
      <div
        className={`rounded-3xl p-6 md:p-8 ${
          isDark
            ? "bg-gradient-to-br from-red-950/40 to-black/60 border border-red-900/30"
            : "bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/50"
        }`}
      >
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
          {/* Album Art */}
          <div className="relative w-48 h-48 md:w-56 md:h-56 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl group">
            <Image
              src={coverArt}
              alt={`${title} cover art`}
              width={224}
              height={224}
              className="object-cover w-full h-full"
              priority
            />
            {/* Play overlay */}
            <button
              onClick={togglePlay}
              className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                isPlaying
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              } ${isDark ? "bg-black/50" : "bg-black/40"}`}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isDark ? "bg-red-600" : "bg-amber-600"
                }`}
              >
                {isPlaying ? (
                  <Pause size={28} className="text-white" fill="currentColor" />
                ) : (
                  <Play
                    size={28}
                    className="text-white ml-1"
                    fill="currentColor"
                  />
                )}
              </div>
            </button>
          </div>

          {/* Info and Controls */}
          <div className="flex-1 flex flex-col items-center md:items-start gap-4 w-full">
            <div className="text-center md:text-left">
              <h2
                className={`text-2xl md:text-3xl font-semibold ${
                  isDark ? "text-white/95" : "text-stone-800"
                }`}
              >
                {title}
              </h2>
              <p
                className={`text-sm md:text-base mt-1 ${
                  isDark ? "text-white/60" : "text-stone-500"
                }`}
              >
                {artist}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                value={isNaN(progress) ? 0 : progress}
                onChange={handleSeek}
                className={`w-full h-2 rounded-full appearance-none cursor-pointer ${
                  isDark ? "bg-white/20" : "bg-black/10"
                } [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 ${
                  isDark
                    ? "[&::-webkit-slider-thumb]:bg-red-500"
                    : "[&::-webkit-slider-thumb]:bg-amber-600"
                }`}
                style={{
                  background: `linear-gradient(to right, ${
                    isDark ? "#ef4444" : "#d97706"
                  } 0%, ${isDark ? "#ef4444" : "#d97706"} ${isNaN(progress) ? 0 : progress}%, ${
                    isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"
                  } ${isNaN(progress) ? 0 : progress}%, ${
                    isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"
                  } 100%)`,
                }}
              />
              <div
                className={`flex justify-between text-xs font-mono ${
                  isDark ? "text-white/40" : "text-stone-400"
                }`}
              >
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Play Button */}
            <button
              onClick={togglePlay}
              className={`flex items-center gap-3 px-6 py-3 rounded-full font-medium transition-all ${
                isDark
                  ? "bg-red-600 hover:bg-red-500 text-white"
                  : "bg-amber-600 hover:bg-amber-500 text-white"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause size={20} fill="currentColor" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play size={20} fill="currentColor" className="ml-0.5" />
                  <span>Play</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Lyrics rendered as markdown */}
      <MarkdownRenderer content={content} theme={theme} />
    </div>
  );
};

export default SongSection;
