"use client";

import { useEffect, useState } from "react";

export function BreathingCircle() {
  const [phase, setPhase] = useState<
    "inhale" | "hold-in" | "exhale" | "hold-out"
  >("inhale");
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const phases: ("inhale" | "hold-in" | "exhale" | "hold-out")[] = [
      "inhale",
      "hold-in",
      "exhale",
      "hold-out",
    ];
    let currentPhaseIndex = 0;

    const interval = setInterval(() => {
      currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
      setPhase(phases[currentPhaseIndex]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase === "inhale") {
      setScale(1.5);
    } else if (phase === "hold-in") {
      setScale(1.5);
    } else if (phase === "exhale") {
      setScale(1);
    } else if (phase === "hold-out") {
      setScale(1);
    }
  }, [phase]);

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Background glow */}
        <div className="absolute inset-0 rounded-full bg-wellness-primary/10 blur-3xl" />

        {/* Animated circle */}
        <div
          className={`absolute inset-0 rounded-full bg-linear-to-br from-wellness-primary to-wellness-positive transition-transform duration-1000 ease-in-out ${
            phase === "inhale" || phase === "hold-in"
              ? "scale-120"
              : "scale-100"
          }`}
          style={{
            opacity: phase === "exhale" || phase === "hold-out" ? 0.4 : 0.7,
          }}
        />

        {/* Inner highlight */}
        <div
          className={`absolute inset-4 rounded-full bg-wellness-muted/30 transition-opacity duration-1000 ${
            phase === "hold-in" ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Center dot */}
        {/* <div className="absolute w-8 h-8 rounded-full bg-wellness-positive" />
         */}
        <img className="absolute w-24 h-24" src={"/Meditate.svg"} />
      </div>

      {/* Phase indicator */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">
          Phase{" "}
          {phase === "inhale"
            ? 1
            : phase === "hold-in"
            ? 2
            : phase === "exhale"
            ? 3
            : 4}{" "}
          of 4
        </p>
        <p className="text-2xl font-semibold text-wellness-primary capitalize">
          {phase === "inhale"
            ? "Inhale"
            : phase === "hold-in"
            ? "Hold"
            : phase === "exhale"
            ? "Exhale"
            : "Hold"}
        </p>
      </div>
    </div>
  );
}
