"use client";

import { useEffect } from "react";
import HomeSection from "./HomeSection";
import BikeSection from "./BikeSection";

export default function DashboardPage() {

  // ✅ Add this
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 300); // 300ms gives BikeSection time to fetch and render
    }
  }, []);

  return (
    <>
      <HomeSection />
      <BikeSection />
    </>
  );
}