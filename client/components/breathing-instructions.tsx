"use client";

import { useEffect, useState } from "react";

export function BreathingInstructions() {
  const [phase, setPhase] = useState<
    "inhale" | "hold-in" | "exhale" | "hold-out"
  >("inhale");
  const [timeLeft, setTimeLeft] = useState(4);

  useEffect(() => {
    const phases: ("inhale" | "hold-in" | "exhale" | "hold-out")[] = [
      "inhale",
      "hold-in",
      "exhale",
      "hold-out",
    ];
    let currentPhaseIndex = 0;

    const phaseInterval = setInterval(() => {
      currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
      setPhase(phases[currentPhaseIndex]);
      setTimeLeft(4);
    }, 4000);

    const countdownInterval = setInterval(() => {
      setTimeLeft((prev) => (prev > 1 ? prev - 1 : 4));
    }, 1000);

    return () => {
      clearInterval(phaseInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  const getInstruction = () => {
    switch (phase) {
      case "inhale":
        return "Breathe in slowly through your nose, filling your lungs completely.";
      case "hold-in":
        return "Hold your breath. Keep your lungs expanded and stay calm.";
      case "exhale":
        return "Exhale slowly through your mouth, releasing all the air gently.";
      case "hold-out":
        return "Hold your breath. Empty your lungs and remain still.";
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-3">
        <p className="text-lg text-muted-foreground">{getInstruction()}</p>
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-wellness-primary/20 flex items-center justify-center">
            <span className="text-xl font-bold text-wellness-primary">
              {timeLeft}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            seconds remaining
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-wellness-accent rounded-full overflow-hidden">
        <div
          className="h-full bg-wellness-primary transition-all duration-1000"
          style={{
            width: `${((4 - timeLeft + 1) / 4) * 100}%`,
          }}
        />
      </div>

      {/* Breathing tips */}
      <div className="mt-8 p-4 bg-wellness-accent rounded-lg">
        <p className="text-xs text-foreground/70 leading-relaxed">
          💡 Box breathing helps activate your parasympathetic nervous system,
          promoting relaxation and reducing stress. Practice this technique
          daily for best results.
        </p>
      </div>
    </div>
  );
}
