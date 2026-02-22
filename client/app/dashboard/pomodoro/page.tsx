"use client";

import { ParticleBackground } from "@/components/particles";
import { PomodoroTimer } from "@/components/timer";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PomodoroPage() {
  return (
    <div className="relative min-h-screen py-8 bg-accent overflow-hidden">
      {/* <ParticleBackground /> */}
      <img
        className="absolute opacity-20 top-0 right-0 w-[450px]"
        src="/Top.svg"
      />
      <img
        className="absolute opacity-20 bottom-0 left-0 w-[450px]"
        src="/Bottom.svg"
      />
      <Link
        href={"/"}
        className="w-12 h-12 fixed z-20 top-16 left-16 cursor-pointer rounded-full bg-white flex justify-center items-center "
      >
        <ChevronLeft width={32} height={32} />
      </Link>
      <PomodoroTimer />
    </div>
  );
}
