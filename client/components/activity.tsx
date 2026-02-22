"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import activityData from "@/data/activity-data.json";

export function Activity() {
  const weeks = useMemo(() => {
    const allDays = Object.values(activityData.yearData[2025]).flat();
    const weeks = [];
    for (let i = 0; i < allDays.length; i += 7) {
      weeks.push(allDays.slice(i, i + 7));
    }
    return weeks;
  }, []);

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getActivityColor = (intensity: number) => {
    switch (intensity) {
      case 0:
        return "#f7faf6"; // wellness-light (no activity)
      case 1:
        return "#d4e6c3"; // wellness-muted (light activity)
      case 2:
        return "#91be78"; // wellness-primary (moderate activity)
      case 3:
        return "#6ba956"; // wellness-positive (high activity)
      default:
        return "#f7faf6";
    }
  };

  return (
    <Card className="w-full bg-linear-to-br from-wellness-accent/30 to-wellness-light border-wellness-muted/40">
      <CardHeader>
        <CardTitle className="text-2xl">Your Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col  gap-8">
          {/* Year Heatmap */}
          <div className="flex-1 overflow-x-auto">
            <div className="inline-flex gap-1 p-4 bg-white/40 rounded-lg border border-wellness-muted/20">
              {/* Day labels */}
              <div className="flex flex-col justify-between pr-2 text-xs text-muted-foreground font-medium">
                <div className="h-6" /> {/* spacing for month label */}
                {dayLabels.map((day) => (
                  <div key={day} className="h-6 flex items-center">
                    {day}
                  </div>
                ))}
              </div>

              {/* Heatmap grid */}
              <div className="flex gap-1">
                {weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-1">
                    {week.map((intensity, dayIdx) => (
                      <div
                        key={`${weekIdx}-${dayIdx}`}
                        className="h-6 w-6 rounded transition-all hover:scale-110 cursor-pointer border border-wellness-muted/20"
                        style={{
                          backgroundColor: getActivityColor(intensity),
                        }}
                        title={`Intensity: ${intensity}/3`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-6 text-sm">
              <span className="text-muted-foreground font-medium">
                Activity level:
              </span>
              <div className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded"
                  style={{ backgroundColor: "#f7faf6" }}
                />
                <span className="text-xs text-muted-foreground">None</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded"
                  style={{ backgroundColor: "#d4e6c3" }}
                />
                <span className="text-xs text-muted-foreground">Light</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded"
                  style={{ backgroundColor: "#91be78" }}
                />
                <span className="text-xs text-muted-foreground">Moderate</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded"
                  style={{ backgroundColor: "#6ba956" }}
                />
                <span className="text-xs text-muted-foreground">High</span>
              </div>
            </div>
          </div>

          {/* Streak & Stats Sidebar */}
          <div className="flex gap-4 w-full">
            {/* Current Streak */}
            <div className="bg-white/60 flex-1 border-l-4 border-l-wellness-primary rounded-lg p-4">
              <p className="text-sm text-muted-foreground font-medium mb-1">
                Current Streak
              </p>
              <p className="text-4xl font-bold text-wellness-primary">
                {activityData.currentStreak}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                days in a row
              </p>
            </div>

            {/* Longest Streak */}
            <div className="bg-white/60 flex-1 border-l-4 border-l-wellness-positive rounded-lg p-4">
              <p className="text-sm text-muted-foreground font-medium mb-1">
                Longest Streak
              </p>
              <p className="text-4xl font-bold text-wellness-positive">
                {activityData.longestStreak}
              </p>
              <p className="text-xs text-muted-foreground mt-2">all time</p>
            </div>

            {/* Total Completions */}
            <div className="bg-white/60 flex-1 border-l-4 border-l-chart-2 rounded-lg p-4">
              <p className="text-sm text-muted-foreground font-medium mb-1">
                Total Completions
              </p>
              <p className="text-4xl font-bold text-chart-2">
                {activityData.totalCompletions}
              </p>
              <p className="text-xs text-muted-foreground mt-2">all time</p>
            </div>

            {/* Completion Rate */}
            <div className="bg-white/60 flex-1 border-l-4 border-l-chart-4 rounded-lg p-4">
              <p className="text-sm text-muted-foreground font-medium mb-1">
                Completion Rate
              </p>
              <p className="text-4xl font-bold text-chart-4">
                {activityData.completionRate}%
              </p>
              <p className="text-xs text-muted-foreground mt-2">this year</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
