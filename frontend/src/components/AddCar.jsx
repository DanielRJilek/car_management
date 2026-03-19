import { useState } from "react";

function AddCar({ onCarAdded }) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("Available");

  async function handleSubmit() {
    try {
      await fetch("https://car-management-x6us.onrender.com/api/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ make, model, year, price, status }),
      });
      setMake("");
      setModel("");
      setYear("");
      setPrice("");
      setStatus("Available");
      onCarAdded();
    } catch (error) {
      console.error("Error adding car:", error);
    }
  }

  return (
    <div>
      <input placeholder="Make" value={make} onChange={(e) => setMake(e.target.value)} />
      <input placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} />
      <input placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} />
      <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option>Available</option>
        <option>Sold</option>
      </select>

      <button onClick={handleSubmit}>Add Car</button>
    </div>
  );
}

export default AddCar;