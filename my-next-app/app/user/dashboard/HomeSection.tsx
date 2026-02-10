"use client";

import Image from "next/image";

export default function HomeSection() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center">
        
        {/* LEFT CONTENT */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Rent the <span className="text-yellow-400">Best Bikes</span>
          </h1>

          <p className="text-zinc-400 mb-6">
            Find affordable bikes for your next adventure.
          </p>

          {/* SEARCH BAR */}
          <div className="bg-zinc-900 p-4 rounded-2xl space-y-3 w-fit">
            <div className="grid sm:grid-cols-2 gap-3">
              
              {/* Location */}
              <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2">
                <span className="text-sm text-yellow-400">📍</span>
                <input
                  type="text"
                  placeholder="Pickup location"
                  className="bg-transparent text-white placeholder-zinc-400 focus:outline-none text-xs w-36"
                />
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2">
                <span className="text-sm text-yellow-400">📅</span>
                <input
                  type="date"
                  className="bg-transparent text-white focus:outline-none text-xs w-36"
                />
              </div>
            </div>

            {/* Button */}
            <button className="bg-yellow-400 text-black text-xs font-semibold px-4 py-2 rounded-lg hover:bg-yellow-300 transition">
              Find Bikes
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center">
          <Image
            src="/image/dirtbike.gif"
            alt="Bike"
            width={420}
            height={420}
            className="object-contain"
            priority
            unoptimized
          />
        </div>

      </div>
    </div>
  );
}
