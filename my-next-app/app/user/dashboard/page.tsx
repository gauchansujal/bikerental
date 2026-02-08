// page.tsx
"use client";

import HomeSection from "./HomeSection";
// import BikeSection from "./BikeSection";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 w-full">
        <HomeSection />
      </main>
    </div>
  );
}