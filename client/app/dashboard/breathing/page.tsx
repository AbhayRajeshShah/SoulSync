"use client";

import { useState, useEffect } from "react";
import { BreathingCircle } from "@/components/breathing-circle";
import { BreathingInstructions } from "@/components/breathing-instructions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function BreathingPage() {
  const [isStarted, setIsStarted] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    if (!isStarted) return;

    const cycleInterval = setInterval(() => {
      setCycleCount((prev) => prev + 1);
    }, 16000); // 4 phases × 4 seconds each

    return () => clearInterval(cycleInterval);
  }, [isStarted]);

  return (
    <div className="min-h-screen bg-linear-to-b from-wellness-light via-background to-wellness-accent/20 flex items-center justify-center p-4">
      {/* Particle background */}
      <Link
        href={"/"}
        className="w-12 h-12 fixed z-20 top-16 left-16 cursor-pointer rounded-full bg-white flex justify-center items-center "
      >
        <ChevronLeft width={32} height={32} />
      </Link>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-wellness-primary/5 blur-2xl"
            style={{
              width: `${50 + i * 50}px`,
              height: `${50 + i * 50}px`,
              animation: `float ${10 + i * 2}s infinite ease-in-out`,
              animationDelay: `${i * 2}s`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Box Breathing
          </h1>
          <p className="text-muted-foreground text-lg">
            A simple technique to calm your mind and reduce stress
          </p>
        </div>

        {isStarted ? (
          <>
            {/* Breathing Circle */}
            <div className="bg-card rounded-2xl p-8 shadow-sm border border-border mb-8">
              <BreathingCircle />
            </div>

            {/* Instructions */}
            <div className="bg-card rounded-2xl p-8 shadow-sm border border-border mb-8">
              <BreathingInstructions />
            </div>

            {/* Statistics */}
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Cycles Completed
                  </p>
                  <p className="text-3xl font-bold text-wellness-primary">
                    {cycleCount}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">
                    Time Elapsed
                  </p>
                  <p className="text-3xl font-bold text-wellness-positive">
                    {Math.floor((cycleCount * 16) / 60)}:
                    {String((cycleCount * 16) % 60).padStart(2, "0")}
                  </p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setIsStarted(false)}
                className="bg-wellness-primary hover:bg-wellness-positive text-primary-foreground px-8"
              >
                Stop Session
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="text-2xl mb-2">🫁</div>
                <h3 className="font-semibold text-foreground mb-2">
                  How It Works
                </h3>
                <p className="text-sm text-muted-foreground">
                  Box breathing involves 4 equal phases: inhale, hold, exhale,
                  and hold again. Each phase lasts 4 seconds.
                </p>
              </div>
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="text-2xl mb-2">✨</div>
                <h3 className="font-semibold text-foreground mb-2">Benefits</h3>
                <p className="text-sm text-muted-foreground">
                  Reduces anxiety, lowers blood pressure, improves focus, and
                  activates your body's relaxation response.
                </p>
              </div>
            </div>

            {/* Preview Circle */}
            <div className="bg-card rounded-2xl p-12 shadow-sm border border-border mb-8 flex justify-center">
              <div className="w-40 h-40 rounded-full bg-linear-to-br from-wellness-primary to-wellness-positive opacity-30" />
            </div>

            {/* Start Button */}
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  setIsStarted(true);
                  setCycleCount(0);
                }}
                size="lg"
                className="bg-wellness-primary hover:bg-wellness-positive text-primary-foreground px-12 h-12 text-lg"
              >
                Begin Breathing Session
              </Button>
            </div>

            {/* Tips */}
            <div className="mt-8 p-4 bg-wellness-accent rounded-lg text-center">
              <p className="text-sm text-foreground/70">
                Find a quiet, comfortable place. You can do this for as long as
                you need.
              </p>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
      `}</style>
    </div>
  );
}
