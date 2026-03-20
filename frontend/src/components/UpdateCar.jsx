import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function UpdateCar({ car, onCarUpdated, onCancel }) {
  const [make, setMake] = useState(car.make);
  const [model, setModel] = useState(car.model);
  const [year, setYear] = useState(car.year);
  const [price, setPrice] = useState(car.price);
  const [status, setStatus] = useState(car.status);

  async function handleUpdate() {
    try {
      await fetch(`${API_URL}/cars/${car._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: car._id, make, model, year, price, status }),
      });
      onCarUpdated();
    } catch (error) {
      console.error("Error updating car:", error);
    }
  }

  return (
    <div className="update-form">
      <h3>Update Car</h3>

      <input placeholder="Make" value={make} onChange={(e) => setMake(e.target.value)} />
      <input placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} />
      <input placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} />
      <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option>Available</option>
        <option>Sold</option>
      </select>

      <button onClick={handleUpdate}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}

export default UpdateCar;