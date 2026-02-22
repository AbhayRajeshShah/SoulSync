"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import Contact from "./Contact";
import { useUser } from "@/providers/UserProvider";
import { useState, useEffect } from "react";
import { Journal, MoodDay } from "@/types/Journal";
import api from "@/lib/axios";
import Link from "next/link";

const moodLabels = {
  1: "distressed",
  2: "upset",
  3: "sad",
  4: "low",
  5: "neutral",
  6: "calm",
  7: "concerned",
  8: "hopeful",
  9: "happy",
  10: "very happy",
};

const heatmapData: [string[], number[]] = [
  ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  [0.65, 0.72, 0.58, 0.68, 0.75, 0.82, 0.78],
];

export function AnalyticsSection() {
  const user = useUser();
  const [journalsData, setJournalsData] = useState<Journal[]>([]);
  const [moodData, setMoodData] = useState<MoodDay[]>();

  useEffect(() => {
    getJournals();
  }, []);

  const getJournals = async () => {
    if (user) {
      let res = await api.get(`journals/user/${user._id}`);
      let data = res.data;
      console.log(data);
      setJournalsData([...data]);
      setMoodData(generateMoodData(data));
    }
  };

  const generateMoodData = (journals: Journal[]): MoodDay[] => {
    // 1–10 typed mood label map
    const moodLabels: Record<number, string> = {
      1: "distressed",
      2: "upset",
      3: "sad",
      4: "low",
      5: "neutral",
      6: "calm",
      7: "concerned",
      8: "hopeful",
      9: "happy",
      10: "very happy",
    };

    const journalByDate: Record<string, Journal> = {};
    journals.forEach((j) => {
      const dateKey = new Date(j.timestamp).toISOString().slice(0, 10);
      journalByDate[dateKey] = j;
    });

    const result: MoodDay[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);

      const dateKey = day.toISOString().slice(0, 10);
      const weekday = day.toLocaleDateString("en-US", { weekday: "short" });

      const journal = journalByDate[dateKey];

      if (journal) {
        const score = journal.mood_score;

        result.push({
          day: weekday,
          mood: score,
          calc:
            (journal?.calculated_score ? journal.calculated_score / 100 : 0) ||
            0,
          label: moodLabels[score] ?? "unknown",
        });
      } else {
        result.push({
          day: weekday,
          mood: null,
          label: "no entry",
        });
      }
    }

    return result;
  };

  const CustomMoodTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0) {
      const mood = payload[0].payload.calc; // mood_score
      const day = payload[0].payload.day; // the day label

      return (
        <div
          style={{
            backgroundColor: "#91BE78",
            padding: "8px 12px",
            borderRadius: "8px",
            color: "white",
          }}
        >
          <p>Mood Score: {mood?.toFixed(2)}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <section className="py-12">
      <div className="flex  gap-8 items-center">
        {/* Mood Trend */}
        <Card className="p-6 flex-1 bg-white/50 border-wellness-accent/20">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Mood Trend
          </h2>
          <ResponsiveContainer width="100%" height={270}>
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="day" stroke="#999" />
              <YAxis domain={[0, 1]} stroke="#999" />
              <Tooltip content={<CustomMoodTooltip />} />
              <Line
                type="monotone"
                dataKey="calc"
                stroke="#91BE78"
                strokeWidth={3}
                dot={{ fill: "#91BE78", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Emotion Heatmap */}
        <div className="flex flex-col flex-1 gap-8">
          <Card className="p-6  bg-white/50 border-wellness-accent/20">
            <div className="flex w-full items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Weekly Emotions
              </h2>
              <Link
                href={`/dashboard/energy`}
                className="px-6 py-2 bg-accent rounded-md"
              >
                Analyze
              </Link>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {moodData &&
                moodData.map((entry, idx) => (
                  <div key={entry.day} className="text-center">
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {entry.day}
                    </p>

                    <div
                      className="w-full aspect-square rounded-lg transition-transform hover:scale-110"
                      style={{
                        backgroundColor: getColorFromMood(entry.mood ?? 0), // fallback for no-entry
                      }}
                      title={`${entry.label} - ${entry.mood ?? "N/A"}`}
                    />
                  </div>
                ))}
            </div>
          </Card>
          <Contact />
        </div>
      </div>
    </section>
  );
}

function getColorFromMood(mood: number) {
  if (mood > 6) return "#91BE78"; // calm/green
  if (mood > 3) return "#F5A623"; // anxious/orange
  if (mood === 0) return "#E0E0E0"; // no entry/gray
  return "#5B9BD5"; // reflective/blue
}
