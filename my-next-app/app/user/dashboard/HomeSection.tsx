"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function HomeSection() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tiltX = ((y / rect.height) - 0.5) * -12;
    const tiltY = ((x / rect.width) - 0.5) * 12;

    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <section className="relative bg-white pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
      {/* Only padding – no max-w-7xl here (handled by layout.tsx) */}
      <div className="px-5 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20 items-start min-h-[70vh]">
          {/* LEFT COLUMN – Text + search */}
          <div className="space-y-8 lg:space-y-10 order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 bg-pink-50 text-pink-700 px-5 py-2.5 rounded-full text-sm font-medium shadow-sm">
              Feel the Thrill 🏍️
            </div>

            {/* Hero text */}
            <p className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 leading-tight">
              Choose from high-performance cruisers, sport bikes, and scooters.{" "}
              <span className="text-gray-600 font-normal">
                Affordable, well-maintained, and ready for the open road.
              </span>
            </p>

            {/* Search bar */}
            <div className="mt-10 bg-zinc-900 rounded-3xl p-1.5 shadow-2xl max-w-lg lg:max-w-xl">
              <div className="bg-zinc-800 rounded-3xl px-5 py-6 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-4">
                    <span className="text-2xl text-pink-400">📍</span>
                    <input
                      type="text"
                      placeholder="Pickup location"
                      className="bg-transparent flex-1 text-white placeholder-zinc-400 focus:outline-none text-base"
                    />
                  </div>
                  <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-4">
                    <span className="text-2xl text-pink-400">📅</span>
                    <input
                      type="date"
                      className="bg-transparent flex-1 text-white focus:outline-none text-base"
                    />
                  </div>
                </div>

                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-lg py-4 rounded-2xl flex items-center justify-center gap-3 transition-colors">
                  <span className="text-2xl">🔍</span>
                  Find Your Ride
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 text-sm sm:text-base text-gray-600 pt-4 font-medium">
              <div>100+ Bikes Available</div>
              <div>5+ City Hubs</div>
              <div>2,000+ Riders Served</div>
            </div>
          </div>

          {/* RIGHT COLUMN – Image */}
          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end items-start">
            {/* Simplified pink background (no scale/rotate to prevent pushing content) */}
            <div className="absolute inset-0 bg-pink-50/30 rounded-3xl -z-10 opacity-70" />

            <div
              ref={imageRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-md sm:max-w-lg lg:max-w-none transition-transform duration-200 ease-out self-start"
              style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`,
              }}
            >
              <div className="overflow-hidden rounded-3xl shadow-2xl border border-white/30">
                <Image
                    src="/image/dirtbike.gif"
                  alt="Group of motorcycle riders"
                  width={1400}
                  height={900}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div> 
      </div>
    </section>
  );
}