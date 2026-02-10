// layout.tsx
import Header from "./dashboard/_components/header";
import Footer from "./dashboard/_components/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col bg-black-100 min-h-screen">
      <Header />
      {children}
      <Footer />
    </section>
  );
}