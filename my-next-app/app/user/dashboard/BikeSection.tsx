// components/BikeSection.tsx
import { useEffect, useState } from "react";
import { fetchAllBikes, Bike } from "../../../lib/actions/bike.action";

export default function BikeSection() {
  // You can later replace this with data from API / props
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllBikes()
      .then((data) => setBikes(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading bikes...</p>;

  
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
      {bikes.map((bike) => (
        <div
          key={bike._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            width: "250px",
            borderRadius: "5px",
          }}
        >
          {bike.imageUrl && (
            <img
              src={`http://localhost:5000${bike.imageUrl}`}
              alt={bike.name}
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />
          )}
          <h3>{bike.name}</h3>
          <p>Brand: {bike.brand}</p>
          <p>Price: {bike.price}</p>
          <p>Engine: {bike.engineCC} cc</p>
          <p>Milage: {bike.milage}</p>
          <p>Available: {bike.isAvilable ? "Yes" : "No"}</p>
        </div>
      ))}
    </div>
  );
}

  
