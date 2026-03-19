import { useState } from "react";

function UpdateCar({ car, onCarUpdated, onCancel }) {
  const [make, setMake] = useState(car.make);
  const [model, setModel] = useState(car.model);
  const [year, setYear] = useState(car.year);
  const [price, setPrice] = useState(car.price);
  const [status, setStatus] = useState(car.status);

  async function handleUpdate() {
    await fetch(`http://localhost:3000/api/cars/${car._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ make, model, year, price, status }),
    });

    onCarUpdated();
  }

  return (
    <div>
      <h3>Update Car</h3>

      <input value={make} onChange={(e) => setMake(e.target.value)} />
      <input value={model} onChange={(e) => setModel(e.target.value)} />
      <input value={year} onChange={(e) => setYear(e.target.value)} />
      <input value={price} onChange={(e) => setPrice(e.target.value)} />

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