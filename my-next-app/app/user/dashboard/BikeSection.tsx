"use client";
import { useEffect, useState } from "react";
import { fetchAllBikes, Bike } from "../../../lib/actions/bike.action";
import { createBooking } from "../../../lib/actions/booking.action";

type BookingStatus = "loading" | "success" | "error" | null;

export default function BikeSection() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState<{ [key: string]: BookingStatus }>({});
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});

  // Modal state
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [returnDate, setReturnDate] = useState("");

  useEffect(() => {
    fetchAllBikes()
      .then((data) => setBikes(data))
      .finally(() => setLoading(false));
  }, []);

  const openModal = (bike: Bike) => {
    setSelectedBike(bike);
    setReturnDate("");
  };

  const closeModal = () => {
    setSelectedBike(null);
    setReturnDate("");
  };

  const dismissError = (bikeId: string) => {
    setBookingStatus((prev) => ({ ...prev, [bikeId]: null }));
    setErrorMessages((prev) => ({ ...prev, [bikeId]: "" }));
  };

  const handleConfirmBooking = async () => {
    // Silent return if no date selected
    if (!selectedBike || !returnDate) return;

    const bikeId = selectedBike._id!;
    setBookingStatus((prev) => ({ ...prev, [bikeId]: "loading" }));
    closeModal();

    try {
      await createBooking(bikeId, new Date(returnDate));
      setBookingStatus((prev) => ({ ...prev, [bikeId]: "success" }));
      setErrorMessages((prev) => ({ ...prev, [bikeId]: "" }));
      setTimeout(() => {
        setBookingStatus((prev) => ({ ...prev, [bikeId]: null }));
      }, 3000);
    } catch (err: any) {
      // Show exact backend error message
      const message = err.response?.data?.message || "Booking failed. Try again.";
      setBookingStatus((prev) => ({ ...prev, [bikeId]: "error" }));
      setErrorMessages((prev) => ({ ...prev, [bikeId]: message }));
    }
  };

  const today = new Date().toISOString().split("T")[0];

  if (loading) return <p className="text-center py-20">Loading bikes...</p>;

  return (
    <section id="bikes" className="bg-gray-50 py-16 px-6">

      {/* TITLE */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Choose Your Perfect Ride
        </h2>
        <p className="text-gray-500 mt-3">
          From nimble scooters for the city to powerful cruisers for the highway
        </p>
      </div>

      {/* BIKE GRID */}
      <div className="max-w-6xl flex flex-wrap gap-10 pl-20">
        {bikes.map((bike) => (
          <div
            key={bike._id}
            className="w-[320px] rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition relative flex flex-col"
          >
            {/* Image */}
            <div className="relative">
              {bike.imageUrl && (
                <img
                  src={`http://localhost:5000${bike.imageUrl}`}
                  alt={bike.name}
                  className="w-full h-[220px] object-cover"
                />
              )}
              {bike.isAvilable && (
                <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  Available
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-lg font-semibold">{bike.name}</h3>
                <span className="text-yellow-500 text-sm font-medium">
                  ★ {bike.milage || "4.8"}
                </span>
              </div>
              <p className="text-xs uppercase text-gray-500 mb-2">{bike.engineCC}</p>
              <p className="text-sm text-gray-500 mb-4">📍 {bike.brand}</p>

              <div className="mt-auto flex items-center justify-between">
                <div className="text-xl font-bold text-red-600">
                  ${bike.price || "45"}
                  <span className="text-sm font-normal text-gray-500"> / day</span>
                </div>

                <button
                  onClick={() => openModal(bike)}
                  disabled={bookingStatus[bike._id!] === "loading"}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm px-4 py-2 rounded-lg transition"
                >
                  {bookingStatus[bike._id!] === "loading" ? "Booking..." : "Rent Now"}
                </button>
              </div>

              {/* Success */}
              {bookingStatus[bike._id!] === "success" && (
                <p className="mt-2 text-green-600 text-xs font-medium text-center">
                  ✅ Booked successfully!
                </p>
              )}

              {/* Error from backend — stays until dismissed */}
              {bookingStatus[bike._id!] === "error" && (
                <div className="mt-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-red-600 text-xs font-medium">
                      ❌ {errorMessages[bike._id!] || "Booking failed. Try again."}
                    </p>
                    <button
                      onClick={() => dismissError(bike._id!)}
                      className="text-red-400 hover:text-red-600 text-xs font-bold shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                  {/* Upload link if DL missing */}
                  {errorMessages[bike._id!]?.toLowerCase().includes("driving license") && (
                    <a
                      href="/user/Uplodedrivinglicense"
                      className="block text-center text-xs text-blue-600 underline mt-1 font-medium"
                    >
                      Upload your documents →
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* BOOKING MODAL */}
      {selectedBike && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Confirm Booking</h2>
            <p className="text-gray-500 text-sm mb-6">
              You are renting{" "}
              <span className="font-semibold text-gray-800">{selectedBike.name}</span>
            </p>

            <div className="flex flex-col gap-4">
              {/* Booking Date — read only */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1 block">
                  Booking Date
                </label>
                <input
                  type="date"
                  value={today}
                  disabled
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-500"
                />
              </div>

              {/* Return Date */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1 block">
                  Return Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  min={today}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              {/* Price */}
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Price per day</span>
                  <span className="font-bold text-red-600">${selectedBike.price}</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              {/* Always clickable */}
              <button
                onClick={handleConfirmBooking}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-sm font-semibold transition"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}