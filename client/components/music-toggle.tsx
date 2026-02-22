"use client"

import { useState } from "react"
import { Music, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MusicToggle() {
  const [isMusicOn, setIsMusicOn] = useState(true)

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsMusicOn(!isMusicOn)}
      className={isMusicOn ? "text-wellness-primary" : "text-muted-foreground"}
    >
      {isMusicOn ? <Volume2 className="w-5 h-5" /> : <Music className="w-5 h-5" />}
    </Button>
  )
}
