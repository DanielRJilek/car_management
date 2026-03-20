import { Fragment, useEffect, useState } from "react";
import "../css/Page.css";
import AddForm from "./AddForm";
import UpdateForm from "./UpdateForm";

const API_URL = import.meta.env.VITE_API_URL;

const CAR_FIELDS = [
  { name: "make", type: "text", placeholder: "Make", defaultValue: "" },
  { name: "model", type: "text", placeholder: "Model", defaultValue: "" },
  { name: "year", type: "text", placeholder: "Year", defaultValue: "" },
  { name: "price", type: "text", placeholder: "Price", defaultValue: "" },
  { name: "status", type: "select", placeholder: "Status", options: ["Available", "Sold"], defaultValue: "Available" }
];

const UPDATE_CAR_FIELDS = [
  { name: "make", type: "text", placeholder: "Make" },
  { name: "model", type: "text", placeholder: "Model" },
  { name: "year", type: "text", placeholder: "Year" },
  { name: "price", type: "text", placeholder: "Price" },
  { name: "status", type: "select", placeholder: "Status", options: ["Available", "Sold"] }
];

function CarsPage() {
  const [cars, setCars] = useState([]);
  const [result, setResult] = useState("");
  const [editingCar, setEditingCar] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [sortPrice, setSortPrice] = useState(null); // null, 'asc', or 'desc'
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMake, setFilterMake] = useState("");
  const [filterModel, setFilterModel] = useState("");

  const CARS_API_URL = `${import.meta.env.VITE_API_URL}/cars`;

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
    if (editingCar && normalizeCarId(editingCar._id) === normalizeCarId(car._id)) {
      setEditingCar(null);
    } else {
      setEditingCar(car);
    }
  }

  function sortCarsByPrice() {
    if (sortPrice === null) {
      setSortPrice('asc');
    } else if (sortPrice === 'asc') {
      setSortPrice('desc');
    } else {
      setSortPrice(null);
    }
  }

  const sortedCars = [...cars]
    .filter(car =>
      (!filterStatus || car.status === filterStatus) &&
      (!filterMake || car.make.toLowerCase().includes(filterMake.toLowerCase())) &&
      (!filterModel || car.model.toLowerCase().includes(filterModel.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortPrice === null) return 0;
      const priceDiff = a.price - b.price;
      return sortPrice === 'asc' ? priceDiff : -priceDiff;
    });

  return (
    <div>
      <div className="inventory-card">
        <h1>Car Inventory</h1>

        <div className="inventory-controls">
          <button onClick={() => setShowAddForm(!showAddForm)}>Add Car</button>

          <button onClick={totalCars}>Total Cars</button>
          <button onClick={totalAvailable}>Total Available Cars</button>
          <button onClick={totalSold}>Total Sold Cars</button>

          <button onClick={sortCarsByPrice}>
            Sort by Price {sortPrice === 'asc' ? '↑' : sortPrice === 'desc' ? '↓' : ''}
          </button>

          <span>{result}</span>
        </div>

        {showAddForm && (
          <AddForm
            title="Add New Car"
            endpoint="/cars"
            fields={CAR_FIELDS}
            buttonLabel="Add Car"
            onSubmit={() => { loadCars(); setShowAddForm(false); }}
          />
        )}

        <table>
          <thead>
            <tr>
              <th>
                Make
                <input
                  type="text"
                  placeholder="Filter"
                  value={filterMake}
                  onChange={(e) => setFilterMake(e.target.value)}
                  style={{marginLeft: '8px', width: '100px', padding: '4px'}}
                />
              </th>
              <th>
                Model
                <input
                  type="text"
                  placeholder="Filter"
                  value={filterModel}
                  onChange={(e) => setFilterModel(e.target.value)}
                  style={{marginLeft: '8px', width: '100px', padding: '4px'}}
                />
              </th>
              <th>Year</th>
              <th>Price</th>
              <th>
                Status
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{marginLeft: '8px', width: '120px'}}>
                  <option value="">All</option>
                  <option value="Available">Available</option>
                  <option value="Sold">Sold</option>
                </select>
              </th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedCars.map((car) => (
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
                      <UpdateForm
                        title="Update Car"
                        item={editingCar}
                        itemId={normalizeCarId(editingCar._id)}
                        endpoint="/cars"
                        fields={UPDATE_CAR_FIELDS}
                        buttonLabel="Save"
                        onSubmit={() => {
                          loadCars();
                          setEditingCar(null);
                        }}
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