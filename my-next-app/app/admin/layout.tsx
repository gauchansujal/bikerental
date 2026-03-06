"use client";

import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";
import { AuthProvider } from "@/context/Authcontext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex w-full bg-white text-gray-900">

        {/* Sidebar - fixed */}
        <div className="hidden xl:flex xl:w-64 xl:flex-col xl:fixed xl:inset-y-0 xl:z-40">
          <Sidebar />
        </div>

        {/* Main column */}
        <div className="flex-1 xl:ml-64 flex flex-col">
          <Header />
          <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
        </div>

      </div>
    </AuthProvider>
  );
}