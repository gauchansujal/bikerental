import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-black mb-4">
          Welcome to My Web API Frontend
        </h1>

        <p className="text-zinc-600">
          This is your custom Home Page
        </p>

        <div className="mt-6 flex gap-6 justify-center">
          <Link
            href="/auth/login"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </Link>

          <Link
            href="/auth/register"
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
