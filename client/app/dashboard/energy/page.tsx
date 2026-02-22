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
  ChevronLeft,
  ChevronRight,
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
import energyData from "@/data/energy-data.json";
import { WeeklyEnergyData } from "@/types/WeeklyData";
import { User } from "@/types/User";

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

export default function EnergySupportDashboard({ u }: { u: User }) {
  const user = u || useUser();
  const [loading, setLoading] = useState(true);
  const [dailyDataState, setDailyDataState] = useState<WeeklyEnergyData>();
  const [journalsData, setJournalsData] = useState<Journal[]>();
  const [status, setStatus] = useState<string>("journal");

  console.log(dailyDataState);

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
    if (journalsData?.length === 0) {
      redirect("/dashboard/journals/create");
    }
    try {
      let res = await aiAPI.post("/weekly-report", {
        weekly_journals: journalsData,
      });
      let data = res.data;
      setDailyDataState(data.weeklyEnergyData);
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
      let res = await api.get(`/journals/getRecentJournals/${user?._id}`);
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

  const { weeklyEnergyData } = energyData;
  const [activeTab, setActiveTab] = useState<"drains" | "boosters">("drains");

  console.log(journalsData);

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
          {/* Header */}
          <header className="bg-white border-b border-border sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-foreground">
                  Your Week in Energy
                </h1>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground px-3">
                    {dailyDataState?.week}
                  </span>
                  <Button variant="outline" size="icon">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground">
                Visualize your energy patterns and behavioral insights
              </p>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-8">
              <Button
                onClick={() => setActiveTab("drains")}
                variant={activeTab === "drains" ? "default" : "outline"}
                className={
                  activeTab === "drains" ? "bg-wellness-primary text-white" : ""
                }
              >
                Energy Drains
              </Button>
              <Button
                onClick={() => setActiveTab("boosters")}
                variant={activeTab === "boosters" ? "default" : "outline"}
                className={
                  activeTab === "boosters"
                    ? "bg-wellness-primary text-white"
                    : ""
                }
              >
                Energy Boosters
              </Button>
            </div>

            {/* Energy Visualization Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {activeTab === "drains"
                ? dailyDataState?.energyDrains.map((drain) => (
                    <Card
                      key={drain.id}
                      className="border-l-4 border-l-red-400"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {drain.factor}
                            </CardTitle>
                            <CardDescription>{drain.frequency}</CardDescription>
                          </div>
                          <div className="text-red-500">
                            {iconMap[drain.icon]}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              Impact Level
                            </span>
                            <span className="text-xl font-bold text-red-500">
                              {drain.impact}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-red-400 h-2 rounded-full"
                              style={{ width: `${drain.impact}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                : dailyDataState?.energyBoosters.map((booster) => (
                    <Card
                      key={booster.id}
                      className="border-l-4 border-l-wellness-primary"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {booster.factor}
                            </CardTitle>
                            <CardDescription>
                              {booster.frequency}
                            </CardDescription>
                          </div>
                          <div className="text-wellness-primary">
                            {iconMap[booster.icon]}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              Impact Level
                            </span>
                            <span className="text-xl font-bold text-wellness-positive">
                              {booster.impact}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-wellness-positive h-2 rounded-full"
                              style={{ width: `${booster.impact}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>

            {/* Behavioral Overlay */}
            <Card className="mb-8 bg-wellness-accent border-wellness-primary">
              <CardHeader>
                <CardTitle>Behavioral Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-wellness-primary">
                      {dailyDataState?.behavioral.averageSleep}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Avg Sleep (hours)
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-wellness-primary">
                      {dailyDataState?.behavioral.exerciseDays}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Exercise Days
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-wellness-primary">
                      {dailyDataState?.behavioral.socialActivities}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Social Activities
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-500">
                      {dailyDataState?.behavioral.stressfulMoments}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Stressful Moments
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Summary */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Weekly Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed text-lg">
                  {dailyDataState?.summary}
                </p>
                <div className="mt-6 flex gap-3">
                  <Link href="/journals">
                    <Button variant="outline">View Journal Entries</Button>
                  </Link>
                  <Link href="/resources">
                    <Button className="bg-wellness-primary text-white hover:bg-wellness-positive">
                      Explore Resources
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </main>
        </>
      )}
    </div>
  );
}
