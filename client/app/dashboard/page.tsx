"use client";
import React from "react";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { AnalyticsSection } from "@/components/analytics-section";
import { ReflectionCard } from "@/components/reflection-card";
import { ResourceCarousel } from "@/components/resource-carousel";
import { Footer } from "@/components/footer";
import { useUser } from "@/providers/UserProvider";
import { Activity } from "@/components/activity";

const Dashboard = () => {
  const user = useUser();
  console.log(user);

  return (
    <div className="min-h-screen bg-linear-to-b from-wellness-light to-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <HeroSection />
        <AnalyticsSection />
        {/* <Activity /> */}
        <ReflectionCard />
        <ResourceCarousel />
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
