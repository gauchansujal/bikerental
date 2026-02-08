// app/bikes/_components/bikes.tsx   ← or app/user/dashboard/_components/bikes.tsx

// "use client";     ← you can add this if you need interactivity later

export default function Bikes() {
  return (
    <div>
      
      {/* Bikes section */}
      <section id="bikes" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Choose Your Perfect Ride
          </h2>

          {/* Your bikes cards / list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Bike card 1 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* image */}
              <div className="h-64 bg-gray-200" />
              <div className="p-6">
                <h3 className="text-xl font-bold">Street Cruiser 500</h3>
                <p className="text-gray-600">$45 / day</p>
                <button className="mt-4 bg-red-600 text-white px-6 py-3 rounded-lg">
                  Rent Now
                </button>
              </div>
            </div>

            {/* More cards... */}
          </div>
        </div>
      </section>

    </div>
  );
}