export interface UserType {
  _id: string;
  name: string;
  email: string;
  role: "student" | "counselor" | string;
  streakCount: number;
  points: number;
  lastJournalDate: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type User = Partial<UserType>;
