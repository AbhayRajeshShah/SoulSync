"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Wind,
  Footprints,
  Sparkles,
  Zap,
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
import { redirect } from "next/navigation";

const iconMap: Record<string, React.ReactNode> = {
  wind: <Wind className="w-6 h-6" />,
  footprints: <Footprints className="w-6 h-6" />,
  sparkles: <Sparkles className="w-6 h-6" />,
  zap: <Zap className="w-6 h-6" />,
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

  useEffect(() => {
    redirect("/dashboard/journals");
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-wellness-light to-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 md:px-8 py-6">
          <h1 className="text-3xl font-bold text-foreground mb-1">
            Today's Check-In
          </h1>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>November 23, 2025</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 md:px-8 py-8">
        {/* Mood Display */}
        <div className="text-center mb-8">
          <div className="text-7xl mb-3">
            {moodEmojis[dailyCheckIn.moodScore]}
          </div>
          <p className="text-muted-foreground capitalize">
            You're feeling {dailyCheckIn.emotionalTone}
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
              {expandedSections.validation ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </CardHeader>
          {expandedSections.validation && (
            <CardContent>
              <p className="text-foreground leading-relaxed text-lg">
                {dailyCheckIn.validation}
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
                {dailyCheckIn.quickFixes.map((fix) => (
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
                    <p className="text-sm text-foreground">{fix.description}</p>
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
                {dailyCheckIn.guidedSupport}
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
              {dailyCheckIn.miniInsight}
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
    </div>
  );
}
