import { useEffect, useState } from "react";
import "../css/cars.css";
import AddCar from "./AddCar";
import UpdateCar from "./UpdateCar";

function CarsPage() {
  const [cars, setCars] = useState([]);
  const [result, setResult] = useState("");
  const [editingCar, setEditingCar] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadCars();
  }, []);

  async function loadCars() {
    try {
      const response = await fetch("https://car-management-x6us.onrender.com/api/cars");
      const data = await response.json();
      const sortedData = data.reverse();
      setCars(sortedData);
    } catch (error) {
      console.log("Error loading cars:", error);
    }
  }

  async function deleteCar(carId) {
    try {
      const response = await fetch(`https://car-management-x6us.onrender.com/api/cars/${carId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete car");
      }

      setCars((prevCars) => prevCars.filter((car) => car._id !== carId));

      if (editingCar && editingCar._id === carId) {
        setEditingCar(null);
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
              <>
                <tr key={car._id}>
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
                {editingCar && editingCar._id === car._id && (
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
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CarsPage;