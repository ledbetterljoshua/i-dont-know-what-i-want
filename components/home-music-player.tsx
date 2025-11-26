"use client";

import { Pause, Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface HomeMusicPlayerProps {
  audioPath: string;
  coverArt: string;
  title: string;
  artist: string;
  theme: "dark" | "light";
}

const HomeMusicPlayer = ({
  audioPath,
  coverArt,
  title,
  artist,
  theme,
}: HomeMusicPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = new Audio(audioPath);
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });

    audio.addEventListener("timeupdate", () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setProgress(0);
    });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [audioPath]);

  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`flex items-center gap-4 rounded-2xl p-3 backdrop-blur-md transition-all ${
        isDark
          ? "bg-white/5 border border-white/10 hover:bg-white/10"
          : "bg-black/5 border border-black/10 hover:bg-black/10"
      }`}
      onClick={togglePlay}
      role="button"
      tabIndex={0}
    >
      {/* Album Art */}
      <div className="relative w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden shadow-lg">
        <Image
          src={coverArt}
          alt={`${title} cover art`}
          width={56}
          height={56}
          className="object-cover w-full h-full"
        />
        {/* Play/Pause overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity ${
            isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          } ${isDark ? "bg-black/40" : "bg-black/30"}`}
        >
          {isPlaying ? (
            <Pause size={20} className="text-white" fill="currentColor" />
          ) : (
            <Play size={20} className="text-white ml-0.5" fill="currentColor" />
          )}
        </div>
      </div>

      {/* Info and Progress */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${
            isDark ? "text-white/90" : "text-stone-800"
          }`}
        >
          {title}
        </p>
        <p
          className={`text-xs truncate ${
            isDark ? "text-white/50" : "text-stone-500"
          }`}
        >
          {artist}
        </p>

        {/* Progress bar */}
        <div className="mt-2 flex items-center gap-2">
          <div
            className={`flex-1 h-1 rounded-full overflow-hidden ${
              isDark ? "bg-white/20" : "bg-black/10"
            }`}
          >
            <div
              className={`h-full transition-all duration-100 ${
                isDark ? "bg-red-500" : "bg-amber-600"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span
            className={`text-[10px] font-mono ${
              isDark ? "text-white/40" : "text-stone-400"
            }`}
          >
            {formatTime((progress / 100) * duration)}
          </span>
        </div>
      </div>

      {/* Play button */}
      <button
        onClick={togglePlay}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          isDark
            ? "bg-red-600 hover:bg-red-500 text-white"
            : "bg-amber-600 hover:bg-amber-500 text-white"
        }`}
      >
        {isPlaying ? (
          <Pause size={16} fill="currentColor" />
        ) : (
          <Play size={16} fill="currentColor" className="ml-0.5" />
        )}
      </button>
    </div>
  );
};

export default HomeMusicPlayer;
