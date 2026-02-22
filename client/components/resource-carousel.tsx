"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Music,
  Clock,
  BookOpen,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const resources = [
  {
    icon: Music,
    title: "Guided Meditation",
    subtitle: "Today's Session",
    description: "10 min - Breathwork for Calm",
    link: "/dashboard/breathing",
  },
  {
    icon: Clock,
    title: "Pomodoro Focus Timer",
    subtitle: "Productivity",
    description: "25 min focused work blocks",
    link: "/dashboard/pomodoro",
  },
  {
    icon: BookOpen,
    title: "How to Handle Exam Stress",
    subtitle: "Short Read",
    description: "Evidence-based tips for students",
  },
  {
    icon: Headphones,
    title: "Uplifting Playlist",
    subtitle: "Music for Motivation",
    description: "Curated by our wellness team",
  },
];

export function ResourceCarousel() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("resource-container");
    if (container) {
      const scrollAmount = 320;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setScrollPosition(
        (prev) => prev + (direction === "left" ? -scrollAmount : scrollAmount)
      );
    }
  };

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          Resources for You
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            className="rounded-full border-wellness-primary text-wellness-primary hover:bg-wellness-primary/10"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="rounded-full border-wellness-primary text-wellness-primary hover:bg-wellness-primary/10"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <div
          id="resource-container"
          className="flex gap-6 overflow-x-hidden scroll-smooth pb-4"
        >
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <Link key={resource.title} href={resource.link || "#"}>
                <Card className="flex-shrink-0 w-80 p-6 bg-white/50 border-wellness-accent/20 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="mb-4 p-3 bg-wellness-primary/10 w-fit rounded-lg">
                    <Icon className="w-6 h-6 text-wellness-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-wellness-primary font-medium mb-2">
                    {resource.subtitle}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {resource.description}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
