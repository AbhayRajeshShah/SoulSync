// Allowed icon names for weekly report items
export type WeeklyEnergyIcon =
  | "briefcase"
  | "moon"
  | "users"
  | "activity"
  | "heart"
  | "smile"
  | "sun"
  | "coffee"
  | "book"
  | "music"
  | "cloud"
  | "cloud_rain"
  | "dumbbell"
  | "rest"
  | "brain"
  | "shield"
  | "compass"
  | "leaf"
  | "water"
  | "zen";

export interface EnergyFactorItem {
  id: number;
  factor: string; // e.g., "Work Stress"
  impact: number; // 0–100
  frequency: string; // e.g., "5 days", "1 incident", "Daily"
  icon: WeeklyEnergyIcon;
}

export interface WeeklyBehavioralStats {
  averageSleep: number; // hours
  exerciseDays: number; // count
  socialActivities: number; // count
  stressfulMoments: number; // count
}

export interface WeeklyEnergyData {
  week: string; // "Nov 22-26, 2025"
  energyDrains: EnergyFactorItem[]; // EXACTLY 3 items
  energyBoosters: EnergyFactorItem[]; // EXACTLY 3 items
  behavioral: WeeklyBehavioralStats;
  summary: string;
}

export interface WeeklyEnergyResponse {
  weeklyEnergyData: WeeklyEnergyData;
}
