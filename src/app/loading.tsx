"use client";

import { useEffect, useRef, useState } from "react";

interface LoadingProps {
  onComplete: () => void;
}

export default function Loading({ onComplete }: LoadingProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const W = 680;
    const H = 520;

    // Red ant path ending exactly at center (340, 260)
    const redAntPoints = [
      { x: -40, y: 440 },
      { x: 90, y: 410 },
      { x: 170, y: 340 },
      { x: 120, y: 200 },
      { x: 200, y: 110 },
      { x: 380, y: 70 },
      { x: 520, y: 140 },
      { x: 560, y: 310 },
      { x: 470, y: 410 },
      { x: 330, y: 420 },
      { x: 230, y: 350 },
      { x: 250, y: 220 },
      { x: 340, y: 190 },
      { x: 410, y: 250 },
      { x: 380, y: 310 },
      { x: 315, y: 290 },
      { x: 340, y: 260 }, // Center
    ];

    // Generate 18 white ants with random sizes, offsets, and paths
    const WHITE_ANTS_COUNT = 18;
    const TRAILS = [] as {
      speed: number;
      offset: number;
      size: number;
      isRed: boolean;
      points?: { x: number; y: number }[];
      t?: number;
    }[];

    for (let i = 0; i < WHITE_ANTS_COUNT; i++) {
      TRAILS.push({
        speed: 0.012 + Math.random() * 0.012,
        offset: Math.random() * 250,
        size: 8 + Math.random() * 7,
        isRed: false,
      });
    }

    // Add 1 single RED ant
    TRAILS.push({
      speed: 0.075, // Travel speed to reach center in ~3.5s
      offset: 0,
      size: 15,
      isRed: true,
    });

    function genPath(seed: number) {
      const pts: { x: number; y: number }[] = [];
      let x = (seed % 3) * 240 + 40;
      let y = (seed % 2) * 260 + 40;
      for (let i = 0; i < 28; i++) {
        x += Math.sin(i * 0.7 + seed) * 70 + Math.cos(i * 0.3 + seed * 2) * 40;
        y += Math.cos(i * 0.5 + seed * 1.5) * 55 + Math.sin(i * 0.9 + seed) * 30;
        x = ((x % (W + 40)) + W + 40) % (W + 40);
        y = ((y % (H + 40)) + H + 40) % (H + 40);
        pts.push({ x, y });
      }
      return pts;
    }

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function getPosOnPath(pts: { x: number; y: number }[], t: number) {
      const total = pts.length - 1;
      const idx = Math.floor(t % total);
      const frac = (t % total) - idx;
      const p0 = pts[idx];
      const p1 = pts[(idx + 1) % pts.length];
      return {
        x: lerp(p0.x, p1.x, frac),
        y: lerp(p0.y, p1.y, frac),
        angle: (Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180) / Math.PI + 90,
      };
    }

    const NS = "http://www.w3.org/2000/svg";

    const antGroups = TRAILS.map((trail, i) => {
      trail.points = trail.isRed ? redAntPoints : genPath(i * 1.7 + 0.5);
      trail.t = trail.offset;

      const g = document.createElementNS(NS, "g");
      const use = document.createElementNS(NS, "use");
      use.setAttribute("href", trail.isRed ? "#red-ant" : "#ant");
      use.setAttribute("transform", `scale(${trail.size / 14})`);
      g.appendChild(use);
      svg.appendChild(g);
      return { g, trail };
    });

    let lastTime: number | null = null;
    let rafId: number;
    let arrived = false;

    const onArrive = () => {
      // Let the red ant stay at the center for 400ms, then trigger site reveal
      setTimeout(() => {
        onComplete();
      }, 400);
    };

    function tick(ts: number) {
      if (!lastTime) lastTime = ts;
      const dt = Math.min((ts - lastTime) / 16.67, 3);
      lastTime = ts;

      antGroups.forEach(({ g, trail }) => {
        if (trail.isRed) {
          const total = redAntPoints.length - 1;
          if (trail.t! < total) {
            trail.t! += trail.speed * dt;
            if (trail.t! >= total) {
              trail.t = total;
              if (!arrived) {
                arrived = true;
                onArrive();
              }
            }
          }
        } else {
          trail.t! += trail.speed * dt;
        }

        const pos = getPosOnPath(trail.points!, trail.t!);
        g.setAttribute(
          "transform",
          `translate(${pos.x.toFixed(1)},${pos.y.toFixed(1)}) rotate(${pos.angle.toFixed(1)})`
        );
      });

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      antGroups.forEach(({ g }) => g.remove());
    };
  }, [onComplete]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "#2b2b2b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Ant canvas */}
      <svg
        ref={svgRef}
        viewBox="0 0 680 520"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <defs>
          {/* White / Translucent ant definition */}
          <g id="ant">
            <ellipse cx="0" cy="-11" rx="3.5" ry="4.5" fill="var(--fg)" opacity="0.32" />
            <ellipse cx="0" cy="-2" rx="4.2" ry="5" fill="var(--fg)" opacity="0.32" />
            <ellipse cx="0" cy="8" rx="5.5" ry="6.5" fill="var(--fg)" opacity="0.32" />
            <circle cx="0" cy="-17" r="3" fill="var(--fg)" opacity="0.32" />
            <line x1="0" y1="-20" x2="-5" y2="-27" stroke="var(--fg)" strokeWidth="0.7" opacity="0.32" />
            <line x1="0" y1="-20" x2="5" y2="-27" stroke="var(--fg)" strokeWidth="0.7" opacity="0.32" />
            <circle cx="-5.5" cy="-27.5" r="0.8" fill="var(--fg)" opacity="0.32" />
            <circle cx="5.5" cy="-27.5" r="0.8" fill="var(--fg)" opacity="0.32" />
            <line x1="-4" y1="-3" x2="-12" y2="-7" stroke="var(--fg)" strokeWidth="0.7" opacity="0.28" />
            <line x1="4" y1="-3" x2="12" y2="-7" stroke="var(--fg)" strokeWidth="0.7" opacity="0.28" />
            <line x1="-4" y1="1" x2="-13" y2="1" stroke="var(--fg)" strokeWidth="0.7" opacity="0.28" />
            <line x1="4" y1="1" x2="13" y2="1" stroke="var(--fg)" strokeWidth="0.7" opacity="0.28" />
            <line x1="-4" y1="5" x2="-11" y2="10" stroke="var(--fg)" strokeWidth="0.7" opacity="0.28" />
            <line x1="4" y1="5" x2="11" y2="10" stroke="var(--fg)" strokeWidth="0.7" opacity="0.28" />
          </g>

          {/* Red ant definition */}
          <g id="red-ant">
            <ellipse cx="0" cy="-11" rx="3.5" ry="4.5" fill="#ff4d4d" opacity="0.95" />
            <ellipse cx="0" cy="-2" rx="4.2" ry="5" fill="#ff4d4d" opacity="0.95" />
            <ellipse cx="0" cy="8" rx="5.5" ry="6.5" fill="#ff4d4d" opacity="0.95" />
            <circle cx="0" cy="-17" r="3" fill="#ff4d4d" opacity="0.95" />
            <line x1="0" y1="-20" x2="-5" y2="-27" stroke="#ff4d4d" strokeWidth="0.8" opacity="0.95" />
            <line x1="0" y1="-20" x2="5" y2="-27" stroke="#ff4d4d" strokeWidth="0.8" opacity="0.95" />
            <circle cx="-5.5" cy="-27.5" r="0.8" fill="#ff4d4d" opacity="0.95" />
            <circle cx="5.5" cy="-27.5" r="0.8" fill="#ff4d4d" opacity="0.95" />
            <line x1="-4" y1="-3" x2="-12" y2="-7" stroke="#ff4d4d" strokeWidth="0.8" opacity="0.85" />
            <line x1="4" y1="-3" x2="12" y2="-7" stroke="#ff4d4d" strokeWidth="0.8" opacity="0.85" />
            <line x1="-4" y1="1" x2="-13" y2="1" stroke="#ff4d4d" strokeWidth="0.8" opacity="0.85" />
            <line x1="4" y1="1" x2="13" y2="1" stroke="#ff4d4d" strokeWidth="0.8" opacity="0.85" />
            <line x1="-4" y1="5" x2="-11" y2="10" stroke="#ff4d4d" strokeWidth="0.8" opacity="0.85" />
            <line x1="4" y1="5" x2="11" y2="10" stroke="#ff4d4d" strokeWidth="0.8" opacity="0.85" />
          </g>
        </defs>
      </svg>


      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');
      `}</style>
    </div>
  );
}
