"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function HomeSection() {
  const [style, setStyle] = useState({});
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [engineCC, setEngineCC] = useState("");
  const [brands, setBrands] = useState<string[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/bike");
        const data = await res.json();
        const uniqueBrands: string[] = [
          ...new Set<string>(data.bikes.map((b: any) => b.brand)),
        ];
        setBrands(uniqueBrands);
      } catch (err) {
        console.error("Failed to fetch brands", err);
      }
    };
    fetchBrands();
  }, []);

  const handleSearch = () => {
    window.dispatchEvent(
      new CustomEvent("bikeSearch", {
        detail: { search, brand, engineCC },
      })
    );
    document.getElementById("bikes")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center bg-white px-6"
    >
      <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <div className="space-y-6">
          <button className="px-4 py-1 text-sm rounded-full border border-red-300 text-red-500 bg-red-50">
            Feel the Thrill 🏍️
          </button>

          <p className="text-gray-500 max-w-md">
            Choose from high-performance cruisers, sport bikes, and scooters.
            Affordable, well-maintained, and ready for the open road.
          </p>

          {/* SEARCH CARD */}
          <div className="bg-slate-800 p-4 rounded-2xl shadow-lg w-full max-w-md space-y-3">

            {/* Row 1: Name search */}
            <input
              type="text"
              placeholder="🔍 Search bike name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full bg-slate-900 text-white placeholder-gray-400 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
            />

            {/* Row 2: Brand + EngineCC */}
            <div className="grid grid-cols-2 gap-3">
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="bg-slate-900 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="">All Brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Engine CC (e.g. 150)"
                value={engineCC}
                onChange={(e) => setEngineCC(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="bg-slate-900 text-white placeholder-gray-400 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <button
              onClick={handleSearch}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
            >
              🔎 Find Your Ride
            </button>
          </div>

          <div className="flex gap-6 text-sm text-gray-400">
            <span>Bikes Available</span>
            <span>City Hubs</span>
            <span>Riders Served</span>
          </div>
        </div>

        {/* RIGHT IMAGE WITH CURSOR ROTATION */}
        <div
          className="flex justify-center md:justify-end"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = ((y / rect.height) - 0.5) * -12;
            const rotateY = ((x / rect.width) - 0.5) * 12;
            setStyle({ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` });
          }}
          onMouseLeave={() =>
            setStyle({ transform: "rotateX(0deg) rotateY(0deg)" })
          }
        >
          <div className="relative" style={{ perspective: "1000px" }}>
            <div className="absolute inset-0 bg-red-200 rounded-3xl rotate-3"></div>
            <Image
              src="/image/dirtbike.gif"
              alt="Bike"
              width={600}
              height={600}
              style={style}
              className="relative rounded-3xl shadow-xl w-[700px] h-[500px] animate-float-rotate transition-transform duration-200"
              priority
              unoptimized
            />
          </div>
        </div>

      </div>
    </section>
  );
}