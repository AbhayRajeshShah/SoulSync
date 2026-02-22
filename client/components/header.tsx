"use client";

import { StreakIcon } from "./streak-icon";
import { MusicToggle } from "./music-toggle";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/providers/UserProvider";
import { useState } from "react";
import Link from "next/link";

export function Header() {
  const user = useUser();
  const [open, setOpen] = useState(false);
  const logout = () => {
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-wellness-accent/20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <img src={"/Logo.svg"} />
          </div>
          <span className="font-semibold text-wellness-primary text-lg hidden md:block">
            SoulSync
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="/dashboard"
            className="text-foreground hover:text-wellness-primary transition"
          >
            Home
          </a>
          <a
            href="/dashboard/journals"
            className="text-foreground hover:text-wellness-primary transition"
          >
            Journal
          </a>
          <a
            href="/resources"
            className="text-foreground hover:text-wellness-primary transition"
          >
            Resources
          </a>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <StreakIcon count={user?.streakCount ? user.streakCount : 0} />
          <MusicToggle />
          <div
            onClick={() => {
              setOpen(!open);
            }}
            className="w-9 h-9 cursor-pointer rounded-full bg-wellness-primary/20 flex items-center justify-center text-wellness-primary font-semibold"
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          {open && (
            <div className="absolute -bottom-[40px] right-[20px] w-fit px-4 py-2 bg-black text-white rounded-md">
              <button onClick={logout}>Logout</button>
            </div>
          )}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
