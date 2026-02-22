"use client";

import type { Journal } from "@/types/Journal";

interface JournalEntryCardProps {
  journal: Journal;
  isSelected: boolean;
  onClick: () => void;
}

const moodScoreEmojis = {
  1: "😔",
  2: "😞",
  3: "😕",
  4: "😐",
  5: "😌",
  6: "🙂",
  7: "😊",
  8: "😄",
  9: "😃",
  10: "🤩",
};

export function JournalEntryCard({
  journal,
  isSelected,
  onClick,
}: JournalEntryCardProps) {
  const formatDate = (dateString: Date | string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const firstTag = journal.tag.split(",")[0].trim();

  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-border cursor-pointer transition-all hover:bg-accent ${
        isSelected ? "bg-primary/10" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl mt-1">
          {moodScoreEmojis[
            journal.mood_score as keyof typeof moodScoreEmojis
          ] || "✨"}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-muted-foreground">
              {formatDate(journal.timestamp)}
            </span>
            <span className="text-xs px-2 py-1 rounded-full border border-border capitalize">
              {firstTag}
            </span>
          </div>
          <h4 className="font-semibold text-foreground truncate line-clamp-1">
            {journal.text.substring(0, 50)}
          </h4>
          <p className="text-sm text-muted-foreground truncate mt-1">
            {journal.text.substring(50, 100)}...
          </p>
        </div>
      </div>
    </div>
  );
}
