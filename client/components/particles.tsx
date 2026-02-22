"use client";

import { useEffect, useRef } from "react";

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Particle {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      baseOpacity: number;
      oscillationPhase: number;
      oscillationSpeed: number;
    }

    const particles: Particle[] = [];

    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 40 + 20,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.1 - 0.05,
        baseOpacity: Math.random() * 0.15 + 0.08,
        oscillationPhase: Math.random() * Math.PI * 2,
        oscillationSpeed: Math.random() * 0.01 + 0.005,
      });
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.oscillationPhase += particle.oscillationSpeed;

        // Wrap around edges smoothly
        if (particle.x < -particle.radius * 2)
          particle.x = canvas.width + particle.radius * 2;
        if (particle.x > canvas.width + particle.radius * 2)
          particle.x = -particle.radius * 2;
        if (particle.y < -particle.radius * 2)
          particle.y = canvas.height + particle.radius * 2;
        if (particle.y > canvas.height + particle.radius * 2)
          particle.y = -particle.radius * 2;

        const oscillation = Math.sin(particle.oscillationPhase) * 0.4;
        const currentOpacity = particle.baseOpacity + oscillation * 0.08;

        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius
        );

        gradient.addColorStop(
          0,
          `rgba(145, 190, 120, ${currentOpacity * 0.6})`
        );
        gradient.addColorStop(
          0.7,
          `rgba(145, 190, 120, ${currentOpacity * 0.3})`
        );
        gradient.addColorStop(1, `rgba(145, 190, 120, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        background: "linear-gradient(135deg, #f7faf6 0%, #e8f3df 100%)",
      }}
    />
  );
}
