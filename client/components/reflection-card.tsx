"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ReflectionCard() {
  return (
    <section className="py-12">
      <Card className="p-8 bg-gradient-to-br from-wellness-primary/10 to-wellness-accent/10 border-wellness-primary/20">
        <p className="text-lg text-foreground mb-6">
          You&apos;ve expressed more joy this week than last. Keep writing to stay mindful 💫
        </p>
        <Button className="bg-wellness-primary hover:bg-wellness-primary/90 text-white">View Journal</Button>
      </Card>
    </section>
  )
}
