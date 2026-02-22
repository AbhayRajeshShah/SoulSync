export interface Journal {
  _id: string;
  user: string;
  text: string;
  timestamp: Date | string;
  mood_score: number;
  article_length: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  tag: string;
  calculated_score?: number;
}

export interface MoodDay {
  day: string;
  mood: number | null;
  label: string;
  calc?: number;
}
