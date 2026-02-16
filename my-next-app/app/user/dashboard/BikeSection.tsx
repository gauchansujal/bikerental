// components/BikeSection.tsx
import { useEffect, useState } from "react";
import { fetchAllBikes, Bike } from "../../../lib/actions/bike.action";

export default function BikeSection() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllBikes()
      .then((data) => setBikes(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading bikes...</p>;

  return (
    <div  
      id="bikes"
      style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "24px",
     
      padding: "20px",
    }}>
      {bikes.map((bike) => (
        <div
          key={bike._id}
          style={{
            width: "320px",
            borderRadius: "12px",
            overflow: "hidden",
            backgroundColor: "#fff",
            boxShadow: "0 4px 15px rgba(0,0,0,0.12)",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Image + Available badge */}
          <div style={{ position: "relative" }}>
            {bike.imageUrl && (
              <img
                src={`http://localhost:5000${bike.imageUrl}`}
                alt={bike.name}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            )}
            {bike.isAvilable && (
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  backgroundColor: "#00c853",
                  color: "#fff",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                }}
              >
                Available
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ padding: "16px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 600 }}>
                {bike.name}
              </h3>
              <span style={{ fontSize: "1.1rem", color: "#ffb300" }}>★ {bike.rating || "4.8"}</span>
            </div>

            <p style={{
              margin: "0 0 8px 0",
              color: "#555",
              fontSize: "0.95rem",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}>
              {bike.engineCC }
            </p>

            <p style={{
              margin: "0 0 16px 0",
              color: "#666",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}>
              <span style={{ fontSize: "1.1rem" }}>📍</span>
              {bike.brand }
            </p>

            <div style={{ marginTop: "auto" }}>
              <div style={{
                fontSize: "1.6rem",
                fontWeight: "bold",
                color: "#d32f2f",
                marginBottom: "12px",
              }}>
                ${bike.price || "45"} <span style={{ fontSize: "1rem", fontWeight: 500 }}>/ day</span>
              </div>

              <button
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#d32f2f",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1.05rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Rent Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}