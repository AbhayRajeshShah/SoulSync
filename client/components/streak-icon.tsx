"use client";

import { useState } from "react";
import { Flame } from "lucide-react";

export function StreakIcon({ count }: { count: number }) {
  const [showTooltip, setShowTooltip] = useState(false);
  console.log(count);
  return (
    <div className="relative">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative group"
      >
        <Flame className="w-6 h-6 text-orange-400 fill-orange-400" />
        <span className="absolute -top-1 -right-2 bg-orange-400 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {count}
        </span>
      </button>
      {showTooltip && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-wellness-primary text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap shadow-lg">
          {count} day streak 🔥
        </div>
      )}
    </div>
  );
}
