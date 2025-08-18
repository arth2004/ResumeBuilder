import React from "react";
import { shimmerStyle } from "../assets/dummystyle";
import { Check } from "react-feather";

const StepProgress = ({ progress = 0 }) => {
  // keep your logic; just ensure progress is a number and clamp a bit
  const pct = Math.max(0, Math.min(100, Number(progress) || 0));

  return (
    <>
      <style>{shimmerStyle}</style>

      <div
        className="relative w-full h-4 bg-white/4 backdrop-blur-2xl overflow-hidden rounded-full border border-white/10"
      >
        {/* subtle background overlay (behind the progress) */}
        {/* <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity blur-xl rounded-3xl from-violet-200 to-fuchsia-200 z-0 pointer-events-none" /> */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-500/20 animate-pulse " />
        {/* Main Progress Bar - width controlled by style */}
        <div
          className={`relative z-10 h-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-600 animate-flow bg-[length:200%_100%] transition-all duration-700 ease-out rounded-full overflow-hidden animate-pulse-glow`}
          style={{ width: `${pct}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />

          {/* Animated Bubbles */}
          <div className="absolute inset-0 opacity-80 pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 w-2 h-2 bg-white rounded-full animate-bubble shadow-lg"
                style={{
                  left: `${(i + 1) * 12}%`,
                  animationDelay: `${i * 0.25}s`,
                  transform: "translateY(-50%)",
                }}
              />
            ))}
          </div>

          {/* Particle Effects */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* glow/edge at current progress */}
        {pct > 0 && (
          <div
            className="absolute top-0 h-full bg-gradient-to-r from-transparent via-white/60 to-white/30 blur-sm pointer-events-none"
            style={{
              left: `${Math.max(0, pct - 4)}%`,
            }}
          />
        )}
      </div>

      <div className="flex justify-between items-center mt-3">
        <div className="text-xs font-bold text-white/60">
          {pct < 25
            ? "Getting Started"
            : pct < 50
            ? "Making Progress"
            : pct < 75
            ? "Almost There"
            : "Nearly Completed"}
        </div>
        <div className="flex items-center gap-2">
          {pct === 100 && (
            <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Check size={12} className="text-white" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StepProgress;
