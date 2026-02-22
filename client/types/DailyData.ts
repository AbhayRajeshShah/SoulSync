export interface DailyCheckInType {
  date: string; // ISO date string e.g. "2025-11-23"
  emotionalTone: string;
  validation: string;
  quickFixes: QuickFix[];
  guidedSupport: string;
  miniInsight: string;
  moodScore: number; // assuming 1–10 scale, but number is fine
}

export interface QuickFix {
  id: number;
  title: string;
  description: string;
  duration: string; // e.g. "5 min"
  icon: string; // could be union type if you want to restrict values
}
