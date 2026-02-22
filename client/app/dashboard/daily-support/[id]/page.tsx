"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Wind,
  Footprints,
  Sparkles,
  Zap,
  Heart,
  HeartCrack,
  Smile,
  Frown,
  Meh,
  Coffee,
  Bed,
  Brain,
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  CloudSun,
  Leaf,
  Moon,
  Sun,
  Feather,
  Anchor,
  Dumbbell,
  Music,
  PenLine,
  BookOpen,
  Timer,
  Move,
  Activity,
  Flame,
  Droplets,
  ShieldCheck,
  HandHeart,
  Compass,
  Calendar,
  TrendingUp,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import dailyData from "@/data/daily-check-in.json";
import { useParams } from "next/navigation";
import { DailyCheckInType } from "@/types/DailyData";
import api from "@/lib/axios";
import { Journal } from "@/types/Journal";
import { useUser } from "@/providers/UserProvider";
import { redirect } from "next/navigation";
import { aiAPI } from "@/lib/axios";
import { get } from "http";

const iconMap: Record<string, React.ReactNode> = {
  wind: <Wind className="w-6 h-6" />,
  footprints: <Footprints className="w-6 h-6" />,
  sparkles: <Sparkles className="w-6 h-6" />,
  zap: <Zap className="w-6 h-6" />,

  // Positive / uplifting
  heart: <Heart className="w-6 h-6" />,
  smile: <Smile className="w-6 h-6" />,
  sun: <Sun className="w-6 h-6" />,
  flame: <Flame className="w-6 h-6" />,
  spark: <Sparkles className="w-6 h-6" />,
  compass: <Compass className="w-6 h-6" />,

  // Negative / heavy emotions
  frown: <Frown className="w-6 h-6" />,
  meh: <Meh className="w-6 h-6" />,
  heart_crack: <HeartCrack className="w-6 h-6" />,
  cloud: <Cloud className="w-6 h-6" />,
  cloud_rain: <CloudRain className="w-6 h-6" />,
  cloud_drizzle: <CloudDrizzle className="w-6 h-6" />,
  cloud_lightning: <CloudLightning className="w-6 h-6" />,

  // Calm / grounding
  moon: <Moon className="w-6 h-6" />,
  feather: <Feather className="w-6 h-6" />,
  anchor: <Anchor className="w-6 h-6" />,
  leaf: <Leaf className="w-6 h-6" />,

  // Actions / coping skills
  music: <Music className="w-6 h-6" />,
  move: <Move className="w-6 h-6" />,
  dumbbell: <Dumbbell className="w-6 h-6" />,
  book: <BookOpen className="w-6 h-6" />,
  pen: <PenLine className="w-6 h-6" />,
  timer: <Timer className="w-6 h-6" />,
  activity: <Activity className="w-6 h-6" />,
  water: <Droplets className="w-6 h-6" />,
  coffee: <Coffee className="w-6 h-6" />,
  rest: <Bed className="w-6 h-6" />,
  shield: <ShieldCheck className="w-6 h-6" />,
  hand_heart: <HandHeart className="w-6 h-6" />,
  brain: <Brain className="w-6 h-6" />,
  cloud_sun: <CloudSun className="w-6 h-6" />,
};

const moodEmojis: Record<number, string> = {
  1: "😢",
  2: "😕",
  3: "😐",
  4: "🙂",
  5: "😰",
  6: "😌",
  7: "😊",
  8: "😄",
  9: "😍",
  10: "🤩",
};

export default function DailySupportDashboard() {
  const params = useParams();
  const id = params.id;
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [dailyDataState, setDailyDataState] = useState<DailyCheckInType>();
  const [journalsData, setJournalsData] = useState<Journal>();
  const [status, setStatus] = useState<string>("journal");

  useEffect(() => {
    if (user) {
      getDailyDataById();
    }
  }, [user]);

  useEffect(() => {
    if (journalsData) {
      getInsights();
    }
  }, [journalsData]);

  const getInsights = async () => {
    try {
      let res = await aiAPI.post("/generate-checkin", {
        article: journalsData?.text,
        tag: journalsData?.tag,
        mood_score: journalsData?.mood_score,
      });
      let data = res.data;
      setDailyDataState(data.dailyCheckIn);
      setLoading(false);
      console.log("Insights data:", data);
    } catch (err) {
      console.log("Error fetching insights:", err);
    }
  };

  const getDailyDataById = async () => {
    let red = false;

    try {
      console.log(user);
      if (!user) {
        red = true;
      }
      let res = await api.get(`/journals/getJournal/${user?._id}/${id}`);
      let data = res.data;
      setTimeout(() => {
        setStatus("insight");
      }, 3000);

      setJournalsData(data);
    } catch (err) {
      red = true;
      console.log("Error fetching daily data by ID:", err);
    }
    if (red) {
      redirect("/login");
    }
  };

  const { dailyCheckIn } = dailyData;
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    validation: true,
    fixes: true,
    support: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div
      className={`min-h-screen ${
        loading
          ? status === "journal"
            ? "bg-accent"
            : "bg-accent"
          : "bg-linear-to-b from-wellness-light to-background"
      }`}
    >
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col gap-6 items-center justify-center">
            <img
              src={status === "journal" ? "/boy.gif" : "/girl.gif"}
              className="w-64 h-64"
            />
            <p
              className={`text-2xl ${
                status === "journal" ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {status === "journal"
                ? "Listening to your inner voice"
                : "Creating musical insights based on your lyrics"}
            </p>
          </div>

          {/* <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-wellness-primary"></div> */}
        </div>
      ) : (
        <>
          <header className="bg-white border-b border-border sticky top-0 z-50">
            <div className="max-w-[80vw] mx-auto px-4 md:px-8 py-6">
              <h1 className="text-3xl font-bold text-foreground mb-1">
                Today's Check-In
              </h1>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{dailyDataState?.date}</span>
              </div>
            </div>
          </header>

          <main className="max-w-[80vw] mx-auto px-4 md:px-8 py-8">
            {/* Mood Display */}
            <div className="text-center mb-8">
              <div className="text-7xl mb-3">
                {dailyDataState ? moodEmojis[dailyDataState.moodScore] : ""}
              </div>
              <p className="text-muted-foreground capitalize">
                You're feeling {dailyDataState?.emotionalTone}
              </p>
            </div>

            {/* Emotion Validation Panel */}
            <Card className="mb-6 bg-blue-50 border-l-4 border-l-blue-400">
              <CardHeader
                className="pb-3 cursor-pointer hover:bg-blue-100/50 transition-colors"
                onClick={() => toggleSection("validation")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    <CardTitle>Emotion Validation</CardTitle>
                  </div>
                  {dailyDataState?.validation ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </CardHeader>
              {expandedSections.validation && (
                <CardContent>
                  <p className="text-foreground leading-relaxed text-lg">
                    {dailyDataState?.validation}
                  </p>
                </CardContent>
              )}
            </Card>

            {/* Quick Fix Suggestions */}
            <Card className="mb-6">
              <CardHeader
                className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleSection("fixes")}
              >
                <div className="flex items-center justify-between">
                  <CardTitle>Quick Fix Suggestions</CardTitle>
                  {expandedSections.fixes ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
                <CardDescription>
                  Try one of these to feel better in minutes
                </CardDescription>
              </CardHeader>
              {expandedSections.fixes && (
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {dailyDataState?.quickFixes.map((fix) => (
                      <div
                        key={fix.id}
                        className="p-4 rounded-lg border-2 border-wellness-muted bg-wellness-accent hover:border-wellness-primary transition-colors cursor-pointer"
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <div className="text-wellness-primary mt-1">
                            {iconMap[fix.icon]}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">
                              {fix.title}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {fix.duration}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-foreground">
                          {fix.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Guided Support */}
            <Card className="mb-6 bg-green-50 border-l-4 border-l-wellness-primary">
              <CardHeader
                className="pb-3 cursor-pointer hover:bg-green-100/50 transition-colors"
                onClick={() => toggleSection("support")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-wellness-primary" />
                    <CardTitle>Guided Support</CardTitle>
                  </div>
                  {expandedSections.support ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </CardHeader>
              {expandedSections.support && (
                <CardContent>
                  <p className="text-foreground leading-relaxed text-lg italic">
                    {dailyDataState?.guidedSupport}
                  </p>
                </CardContent>
              )}
            </Card>

            {/* Mini Daily Insight */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-base">Today's Insight</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">
                  {dailyDataState?.miniInsight}
                </p>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/energy" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  View Weekly Overview
                </Button>
              </Link>
              <Link href="/journals" className="flex-1">
                <Button className="w-full bg-wellness-primary text-white hover:bg-wellness-positive">
                  Write Journal Entry
                </Button>
              </Link>
            </div>
          </main>
        </>
      )}
    </div>
  );
}
