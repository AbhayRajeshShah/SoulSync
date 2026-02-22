"use client";
import { useEffect, useState } from "react";
import { quotesApi } from "@/lib/axios";
import { useUser } from "@/providers/UserProvider";

export function HeroSection() {
  const user = useUser();
  // const [quote, setQuote] = useState("");
  // useEffect(()=>{
  //   getQuote();
  // },[]);
  // const getQuote = async () => {
  //   let response = await quotesApi.get("");
  //   setQuote(response.data[0].quote);
  // }
  return (
    <section className="py-12 md:py-16 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
        Hey {user?.name} 👋, you&apos;ve been calm lately
      </h1>
      <p className="text-lg text-wellness-positive mb-6">
        Great job staying consistent 🌿
      </p>
      <p className="text-lg italic text-muted-foreground max-w-2xl mx-auto">
        &quot;Progress, not perfection.&quot;
      </p>
    </section>
  );
}
