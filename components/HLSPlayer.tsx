"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export default function HLSPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  const [showControls, setShowControls] = useState(true);

  const [levels, setLevels] = useState<any[]>([]);
  const [currentLevel, setCurrentLevel] = useState(-1);

  const [playbackRate, setPlaybackRate] = useState(1);

  let hideTimer: any;

  // ---------------- HLS SETUP ----------------
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("✅ HLS Loaded");

        // Load quality levels
        setLevels(hls.levels);
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        console.log("❌ HLS Error:", data);

        if (!hls) return;

        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src; // Safari support
    }

    return () => {
      hlsRef.current?.destroy();
    };
  }, [src]);

  // ---------------- PLAY / PAUSE ----------------
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  // ---------------- TIME UPDATE ----------------
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    setProgress(video.currentTime);
    setDuration(video.duration || 0);
  };

  // ---------------- SEEK ----------------
  const handleSeek = (e: any) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = e.target.value;
    setProgress(e.target.value);
  };

  // ---------------- VOLUME ----------------
  const handleVolume = (e: any) => {
    const video = videoRef.current;
    if (!video) return;

    const val = e.target.value;
    video.volume = val;
    setVolume(val);
    setMuted(val == 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const newMuted = !muted;
    video.muted = newMuted;
    setMuted(newMuted);
  };

  // ---------------- QUALITY ----------------
  const changeQuality = (level: number) => {
    const hls = hlsRef.current;
    if (!hls) return;

    hls.currentLevel = level;
    setCurrentLevel(level);
  };

  // ---------------- SPEED ----------------
  const changeSpeed = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
  };

  // ---------------- KEYBOARD SHORTCUTS ----------------
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const video = videoRef.current;
      if (!video) return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowRight":
          video.currentTime += 5;
          break;
        case "ArrowLeft":
          video.currentTime -= 5;
          break;
        case "m":
          toggleMute();
          break;
        case "f":
          video.requestFullscreen();
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [muted, playing]);

  // ---------------- AUTO HIDE ----------------
  const showControlsTemporarily = () => {
    setShowControls(true);
    clearTimeout(hideTimer);

    hideTimer = setTimeout(() => {
      setShowControls(false);
    }, 2500);
  };

  // ---------------- FORMAT TIME ----------------
  const formatTime = (t: number) => {
    if (!t) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div
      className="relative w-full h-[420px] bg-black rounded-xl overflow-hidden"
      onMouseMove={showControlsTemporarily}
    >
      {/* VIDEO */}
      <video
        ref={videoRef}
        className="w-full h-full"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
      />

      {/* CENTER PLAY */}
      {!playing && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center text-white text-5xl bg-black/40"
        >
          ▶
        </button>
      )}

      {/* CONTROLS */}
      {showControls && (
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3">
          
          {/* PROGRESS */}
          <input
            type="range"
            min={0}
            max={duration}
            value={progress}
            onChange={handleSeek}
            className="w-full"
          />

          {/* BAR */}
          <div className="flex justify-between items-center text-white text-sm mt-2">

            {/* LEFT */}
            <div className="flex items-center gap-3">
              <button onClick={togglePlay}>
                {playing ? "⏸" : "▶"}
              </button>

              <button onClick={toggleMute}>
                {muted || volume == 0 ? "🔇" : "🔊"}
              </button>

              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={volume}
                onChange={handleVolume}
                className="w-20"
              />

              <span>
                {formatTime(progress)} / {formatTime(duration)}
              </span>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">

              {/* QUALITY */}
              {levels.length > 0 && (
                <select
                  value={currentLevel}
                  onChange={(e) => changeQuality(Number(e.target.value))}
                  className="bg-black text-white text-xs"
                >
                  <option value={-1}>Auto</option>
                  {levels.map((l, i) => (
                    <option key={i} value={i}>
                      {l.height}p
                    </option>
                  ))}
                </select>
              )}

              {/* SPEED */}
              <select
                value={playbackRate}
                onChange={(e) => changeSpeed(Number(e.target.value))}
                className="bg-black text-white text-xs"
              >
                {[0.5, 1, 1.5, 2].map((s) => (
                  <option key={s} value={s}>
                    {s}x
                  </option>
                ))}
              </select>

              {/* FULLSCREEN */}
              <button onClick={() => videoRef.current?.requestFullscreen()}>
                ⛶
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}