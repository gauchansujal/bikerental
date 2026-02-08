import Header from "@/app/_components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-7xl xl:max-w-screen-xl 2xl:max-w-screen-2xl px-5 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-8 lg:py-12">
          {children}
        </div>
      </main>
    </section>
  );
}