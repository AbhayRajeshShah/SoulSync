"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save } from "lucide-react";
import Link from "next/link";
import type { Journal } from "@/types/Journal";
import { useUser } from "@/providers/UserProvider";
import { redirect } from "next/navigation";
import api from "@/lib/axios";

const moodScales = [
  { value: 1, label: "Very Poor", emoji: "😔" },
  { value: 2, label: "Poor", emoji: "😞" },
  { value: 3, label: "Below Average", emoji: "😕" },
  { value: 4, label: "Average", emoji: "😐" },
  { value: 5, label: "Fair", emoji: "😌" },
  { value: 6, label: "Good", emoji: "🙂" },
  { value: 7, label: "Very Good", emoji: "😊" },
  { value: 8, label: "Excellent", emoji: "😄" },
  { value: 9, label: "Outstanding", emoji: "😃" },
  { value: 10, label: "Perfect", emoji: "🤩" },
];

export default function CreateJournalPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [moodScore, setMoodScore] = useState(7);
  const [tags, setTags] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const user = useUser();

  const handleSave = async () => {
    if (!text.trim()) {
      alert("Please write your journal entry");
      return;
    }

    setIsSaving(true);

    const wordCount = text.trim().split(/\s+/).length;
    const newJournal: Journal = {
      _id: Date.now().toString(),
      user: "user_123",
      text: text,
      timestamp: new Date(),
      mood_score: moodScore,
      article_length: wordCount,
      createdAt: new Date(),
      updatedAt: new Date(),
      tag: tags || "general",
    };

    console.log("[v0] New journal entry created:", newJournal);
    try {
      if (user) {
        let res = await api.post("journals", {
          text,
          userId: user._id,
          mood_score: moodScore,
          tags: tags,
        });
        let data = res.data;
        setTimeout(() => {
          setIsSaving(false);
          redirect("/dashboard/journals");
        }, 500);
      }
    } catch (e) {
      setIsSaving(false);
    }
  };

  const tagArray = tags
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/journals"
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <ChevronLeft size={24} className="text-muted-foreground" />
            </Link>
            <h1 className="text-2xl font-bold">Create New Journal Entry</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all"
          >
            <Save size={20} />
            {isSaving ? "Saving..." : "Save Entry"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Mood Score Selector */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-muted-foreground mb-4">
            How are you feeling?
          </label>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {moodScales.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setMoodScore(mood.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  moodScore === mood.value
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-2xl mb-1">{mood.emoji}</div>
                <div className="text-xs font-semibold text-foreground">
                  {mood.value}
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Selected: {moodScales.find((m) => m.value === moodScore)?.label}
          </p>
        </div>

        {/* Text Entry Area */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-muted-foreground mb-3">
            Your Thoughts
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your thoughts, feelings, and reflections here..."
            className="w-full h-96 px-4 py-4 bg-accent border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary outline-none resize-none transition-colors"
          />
          <div className="mt-2 text-xs text-muted-foreground">
            {wordCount} words · {text.length} characters
          </div>
        </div>

        {/* Tags Input */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-muted-foreground mb-3">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="reflection, mindfulness, growth"
            className="w-full px-4 py-3 bg-accent border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors"
          />
          {tagArray.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tagArray.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20 capitalize"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Date Info */}
        <div className="p-4 bg-accent border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Entry Date:</span>{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
