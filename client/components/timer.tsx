"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";

interface TimerOption {
  label: string;
  minutes: number;
}

export function PomodoroTimer() {
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const timerOptions: TimerOption[] = [
    { label: "Short Break", minutes: 5 },
    { label: "Focus", minutes: 25 },
    { label: "Extended", minutes: 50 },
    { label: "Long Break", minutes: 15 },
  ];

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playNotification();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const playNotification = () => {
    if (!isMuted && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        console.log("[v0] Audio playback failed");
      });
    }
  };

  const handleSelectTimer = (minutes: number) => {
    setSelectedMinutes(minutes);
    setTimeLeft(minutes * 60);
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedMinutes * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = (timeLeft / (selectedMinutes * 60)) * 100;

  return (
    <div className="relative z-10 flex flex-col items-center justify-center gap-8 px-4">
      <audio
        ref={audioRef}
        src="data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=="
        preload="auto"
      />

      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-7xl font-bold text-wellness-primary">
          Focus Time
        </h1>
        <p className="text-lg text-muted-foreground">
          Stay focused, one session at a time
        </p>
      </div>

      {/* Timer Display */}
      <div className="relative w-80 h-80 md:w-96 md:h-96">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="95"
            fill="none"
            stroke="#e8f3df"
            strokeWidth="8"
          />
          <circle
            cx="100"
            cy="100"
            r="95"
            fill="none"
            stroke="#91be78"
            strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 95}`}
            strokeDashoffset={`${2 * Math.PI * 95 * (1 - progress / 100)}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-6xl md:text-7xl font-bold text-foreground tabular-nums">
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            {isRunning ? "Focusing..." : "Ready to focus?"}
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-4">
        <Button
          size="lg"
          className="gap-2 bg-wellness-primary hover:bg-wellness-positive text-white rounded-full px-8"
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Start
            </>
          )}
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="gap-2 rounded-full px-8 bg-transparent"
          onClick={handleReset}
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </Button>

        <Button
          size="lg"
          variant="ghost"
          className="rounded-full px-6"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Volume2 className="w-5 h-5 text-wellness-primary" />
          )}
        </Button>
      </div>

      {/* Timer Options */}
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        {timerOptions.map((option) => (
          <Button
            key={option.minutes}
            variant={selectedMinutes === option.minutes ? "default" : "outline"}
            className={`rounded-full px-6 ${
              selectedMinutes === option.minutes
                ? "bg-wellness-primary hover:bg-wellness-positive text-white"
                : "hover:bg-accent"
            }`}
            onClick={() => handleSelectTimer(option.minutes)}
            disabled={isRunning}
          >
            {option.label}
            <span className="ml-2 text-sm opacity-75">{option.minutes}m</span>
          </Button>
        ))}
      </div>

      {/* Tips
      <div className="mt-12 max-w-md text-center space-y-4 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
        <h3 className="font-semibold text-foreground">Focus Tips</h3>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>📱 Put your phone away</li>
          <li>💧 Stay hydrated and comfortable</li>
          <li>🎧 Use calming background music</li>
          <li>✨ Celebrate completed sessions</li>
        </ul>
      </div> */}
    </div>
  );
}
