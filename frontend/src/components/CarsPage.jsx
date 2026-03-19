import { Fragment, useEffect, useState } from "react";
import "../css/cars.css";
import AddCar from "./AddCar";
import UpdateCar from "./UpdateCar";

function CarsPage() {
  const [cars, setCars] = useState([]);
  const [result, setResult] = useState("");
  const [editingCar, setEditingCar] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const CARS_API_URL = "https://car-management-x6us.onrender.com/api/cars";

  function normalizeCarId(id) {
    if (id && typeof id === "object" && "$oid" in id) {
      return String(id.$oid);
    }

    return String(id);
  }

  useEffect(() => {
    loadCars();
  }, []);

  async function loadCars() {
    try {
      const response = await fetch(CARS_API_URL);
      const data = await response.json();
      const sortedData = data.reverse();
      setCars(sortedData);
    } catch (error) {
      console.log("Error loading cars:", error);
    }
  }

  async function deleteCar(carId) {
    const targetId = normalizeCarId(carId);

    setCars((prevCars) => prevCars.filter((car) => normalizeCarId(car._id) !== targetId));

    if (editingCar && normalizeCarId(editingCar._id) === targetId) {
      setEditingCar(null);
    }

    try {
      const response = await fetch(`${CARS_API_URL}/${targetId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.log("Delete request failed on server");
      }
    } catch (error) {
      console.log("Error deleting car:", error);
    }
  }

  function totalCars() {
    setResult(`Total Cars: ${cars.length}`);
  }

  function totalAvailable() {
    const count = cars.filter((car) => car.status === "Available").length;
    setResult(`Total Available Cars: ${count}`);
  }

  function totalSold() {
    const count = cars.filter((car) => car.status === "Sold").length;
    setResult(`Total Sold Cars: ${count}`);
  }

  function handleUpdateCar(car) {
    setEditingCar(car);
  }

  function handleCancelUpdate() {
    setEditingCar(null);
  }

  return (
    <div>
      <div className="inventory-card">
        <h1>Car Inventory</h1>

        <div className="inventory-controls">
          <button onClick={() => setShowAddForm(!showAddForm)}>Add Car</button>

          <button onClick={totalCars}>Total Cars</button>
          <button onClick={totalAvailable}>Total Available Cars</button>
          <button onClick={totalSold}>Total Sold Cars</button>

          <span>{result}</span>
        </div>

        {showAddForm && (
          <AddCar onCarAdded={() => { loadCars(); setShowAddForm(false); }} />
        )}

        <table>
          <thead>
            <tr>
              <th>Make</th>
              <th>Model</th>
              <th>Year</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {cars.map((car) => (
              <Fragment key={normalizeCarId(car._id)}>
                <tr>
                  <td>{car.make}</td>
                  <td>{car.model}</td>
                  <td>{car.year}</td>
                  <td>${car.price}</td>
                  <td>{car.status}</td>
                  <td>
                    <button onClick={() => handleUpdateCar(car)}>
                      Update
                    </button>
                    <button onClick={() => deleteCar(car._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
                {editingCar && normalizeCarId(editingCar._id) === normalizeCarId(car._id) && (
                  <tr>
                    <td colSpan="6">
                      <UpdateCar
                        car={editingCar}
                        onCarUpdated={() => {
                          loadCars();
                          setEditingCar(null);
                        }}
                        onCancel={handleCancelUpdate}
                      />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CarsPage;