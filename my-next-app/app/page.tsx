import Link from "next/link";
import Image from 'next/image';

export default function Home() {
  return (
    <div className="fixed inset-0 w-full h-screen overfloden">
      {/* Full-screen background image */}
      <Image
        src="/image/dirtbike.gif"
        alt="Animated dirt bike in action"
        fill
        className="object-cover"
        quality={85}
        priority
        unoptimized
      />

      {/* Optional subtle overlay to improve text readability */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Content on top */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-xl">
            Welcome to My Web API Frontend
          </h1>

          <p className="text-xl md:text-2xl text-zinc-200 mb-10 drop-shadow-md">
            This is your custom Home Page
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/auth/login"
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg"
            >
              Login
            </Link>

            <Link
              href="/auth/register"
              className="px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition shadow-lg"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}