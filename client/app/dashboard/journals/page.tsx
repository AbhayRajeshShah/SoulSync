"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Tag,
  Heart,
} from "lucide-react";
import type { Journal } from "@/types/Journal";
import api from "@/lib/axios";
import { useUser } from "@/providers/UserProvider";
// import jData from "@/data/journal.json";
import journalsData from "@/data/journal.json";

const categoryTags = {
  reflective: "Personal",
  anxious: "Personal",
  peaceful: "Personal",
  motivated: "Work",
  adventurous: "Trips",
  grateful: "Social",
  joyful: "Events",
  excited: "Education",
};

const categoryColors = {
  Personal: "bg-emerald-100 text-emerald-700 border-emerald-300",
  Work: "bg-purple-100 text-purple-700 border-purple-300",
  Events: "bg-blue-100 text-blue-700 border-blue-300",
  Trips: "bg-orange-100 text-orange-700 border-orange-300",
  Education: "bg-cyan-100 text-cyan-700 border-cyan-300",
  Social: "bg-pink-100 text-pink-700 border-pink-300",
};

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

export default function JournalsPage() {
  const [selectedId, setSelectedId] = useState("1");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 10, 1));
  const user = useUser();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [journalsData, setJournalsData] = useState<Journal[]>([]);

  useEffect(() => {
    // Listen for speech end events to reset state
    const handleEnd = () => setIsSpeaking(false);
    window.speechSynthesis.addEventListener("end", handleEnd);
    window.speechSynthesis.addEventListener("error", handleEnd);
    getJournals();
    return () => {
      window.speechSynthesis.removeEventListener("end", handleEnd);
      window.speechSynthesis.removeEventListener("error", handleEnd);
    };
  }, []);

  const getJournals = async () => {
    if (user) {
      let res = await api.get(`journals/user/${user._id}`);
      let data = res.data;
      console.log(data);
      setJournalsData([...data]);
    }
  };

  useEffect(() => {
    console.log(journalsData);
  }, [journalsData]);

  const toggleTTS = () => {
    if (!("speechSynthesis" in window)) {
      alert("Sorry, your browser does not support TTS.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel(); // stop speaking
      setIsSpeaking(false);
    } else {
      if (selectedJournal) {
        const utterance = new SpeechSynthesisUtterance(selectedJournal.text);
        utterance.lang = "en-US";
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
        utterance.volume = 1.0;

        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  const categories = [
    "All",
    "Personal",
    "Work",
    "Events",
    "Trips",
    "Education",
    "Social",
  ];

  const filteredJournals = useMemo(() => {
    const journals = journalsData;
    if (selectedCategory === "All") return journals;
    return journals.filter((j) => {
      const tagsList = j.tag.split(",").map((t) => t.trim().toLowerCase());
      return (
        Object.values(categoryTags).includes(selectedCategory) &&
        tagsList.some(
          (t) => selectedCategory.toLowerCase() === t.split(/[\s,]+/)[0]
        )
      );
    });
  }, [selectedCategory, journalsData]);

  const selectedJournal = (journalsData as Journal[]).find(
    (j) => j._id === selectedId
  );

  const formatDate = (dateString: Date | string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  console.log(journalsData);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="w-56 border-r border-border bg-background flex flex-col">
        <div className="p-6 border-b flex gap-2 items-center border-border">
          <Link href={"/dashboard"} className="cursor-pointer">
            <ChevronLeft />
          </Link>
          <h2 className="text-2xl font-bold font-sans text-foreground">
            Journals
          </h2>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-accent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Create New Button */}
        <div className="p-4 border-t border-border">
          <Link
            href="/dashboard/journals/create"
            className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            New Entry
          </Link>
        </div>
      </div>

      {/* Journals List */}
      <div className="w-80 border-r border-border bg-background flex flex-col overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold text-foreground mb-1">Recent Entries</h3>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredJournals.map((journal) => {
            const firstTag = journal.tag.split(",")[0].trim();
            return (
              <button
                key={journal._id}
                onClick={() => setSelectedId(journal._id)}
                className={`w-full p-4 border-b border-border text-left transition-all hover:bg-accent ${
                  selectedId === journal._id ? "bg-primary/10" : ""
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
                      <span
                        className={`text-xs px-2 py-1 rounded-full border capitalize`}
                      >
                        {firstTag}
                      </span>
                    </div>
                    <h4 className="font-semibold text-foreground truncate line-clamp-1">
                      {journal.text.substring(0, 40)}...
                    </h4>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {journal.text.substring(0, 50)}...
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
          {filteredJournals.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No journal entries found for this category.
            </div>
          )}
        </div>
      </div>

      {/* Journal Detail View */}
      <div className="flex-1 flex flex-col bg-background">
        {selectedJournal ? (
          <>
            {/* Header */}
            <div className="border-b p-6 border-border flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    {formatDate(selectedJournal.timestamp)}
                  </p>

                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl max-w-[80%] font-bold text-foreground">
                      {selectedJournal.text.substring(0, 60)}
                    </h1>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-3 hover:red-100 rounded-lg transition-colors">
                    <Trash2 size={20} className="text-destructive" />
                  </button>
                </div>
              </div>
              <div className="flex">
                <button
                  className={`w-fit p-2 cursor-pointer ${
                    isSpeaking ? "hover bg-red-100" : "hover:bg-accent"
                  } rounded-full transition-colors`}
                  onClick={toggleTTS}
                >
                  {isSpeaking ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-destructive"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {/* Pause Icon */}
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 9v6m4-6v6"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {/* Play Icon */}
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 5l7 7-7 7V5z"
                      />
                    </svg>
                  )}
                </button>
                <Link href={`/dashboard/daily-support/${selectedJournal._id}`}>
                  <button className="px-4 py-2 cursor-pointer bg-blue-100 rounded-lg">
                    Analyze
                  </button>
                </Link>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose max-w-none">
                <p className="text-foreground whitespace-pre-wrap text-base leading-relaxed">
                  {selectedJournal.text}
                </p>
              </div>

              {/* Metadata */}
              <div className="mt-8 pt-6 border-t border-border grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Tag size={16} />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJournal.tag.split(",").map((tag) => (
                      <span
                        key={tag.trim()}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20 capitalize"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Heart size={16} />
                    Mood Score
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {
                        moodScoreEmojis[
                          selectedJournal.mood_score as keyof typeof moodScoreEmojis
                        ]
                      }
                    </span>
                    <div>
                      <div className="font-semibold text-foreground">
                        {selectedJournal.mood_score}/10
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {selectedJournal.article_length} words
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <p className="text-muted-foreground">
              Select a journal entry to view details
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
