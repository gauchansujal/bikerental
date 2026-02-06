// app/admin/layout.tsx   (or wherever this file lives)
"use client";   // ← very important — this layout now contains client components + context

import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";
import { AuthProvider } from "@/context/Authcontext";   // check path — is it Authcontext or AuthContext?

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex w-full min-h-screen bg-background text-foreground">
        <div className="page-wrapper flex w-full">
          {/* Sidebar – hidden on mobile/small screens */}
          <div className="hidden xl:block">
            <Sidebar />
          </div>

          {/* Main column */}
          <div className="flex-1 flex flex-col min-h-screen bg-background">
            {/* Top Header */}
            <Header />

            {/* Page content */}
            <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}