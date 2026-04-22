import { Fragment, useEffect, useState, useRef } from "react";
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
  const [showStats, setShowStats] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMake, setFilterMake] = useState("");
  const [filterModel, setFilterModel] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState(null); // null, 'asc', or 'desc'

  const yesButtonRef = useRef(null);
  const noButtonRef = useRef(null);

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

  useEffect(() => {
    if (showDeleteConfirm && yesButtonRef.current) {
      yesButtonRef.current.focus();
    }
  }, [showDeleteConfirm]);

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
    setShowStats(!showStats);
  }

  function totalAvailable() {
    const count = cars.filter((car) => car.status === "Available").length;
    setResult(`Total Available Cars: ${count}`);
    setShowStats(!showStats);
  }

  function totalSold() {
    const count = cars.filter((car) => car.status === "Sold").length;
    setResult(`Total Sold Cars: ${count}`);
    setShowStats(!showStats);
  }

  function handleUpdateCar(car) {
    if (editingCar && normalizeCarId(editingCar._id) === normalizeCarId(car._id)) {
      setEditingCar(null);
    } else {
      setEditingCar(car);
    }
  }

  function handleSort(field) {
    if (sortField === field) {
      if (sortDir === null) {
        setSortDir('asc');
      } else if (sortDir === 'asc') {
        setSortDir('desc');
      } else {
        setSortField(null);
        setSortDir(null);
      }
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  }

  function handleDialogKeyDown(e) {
    if (e.key === 'Escape') {
      setShowDeleteConfirm(false);
      setCarToDelete(null);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (e.target === yesButtonRef.current) {
        noButtonRef.current.focus();
      } else if (e.target === noButtonRef.current) {
        yesButtonRef.current.focus();
      }
    }
  }

  const filteredCars = cars.filter(car =>
    (!filterStatus || car.status === filterStatus) &&
    (!filterMake || car.make.toLowerCase().includes(filterMake.toLowerCase())) &&
    (!filterModel || car.model.toLowerCase().includes(filterModel.toLowerCase())) &&
    (!filterYear || car.year.toString().includes(filterYear)) &&
    (!filterPrice || car.price.toString().includes(filterPrice))
  );

  const sortedCars = [...filteredCars].sort((a, b) => {
    if (sortField === null || sortDir === null) return 0;
    
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle numeric values
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDir === 'asc' ? aValue - bValue : bValue - aValue;
    }
    // Handle strings
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
      return sortDir === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    
    return 0;
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
        </div>

        <div className="stats-display" style={{minHeight: '24px', textAlign: 'center', marginTop: '16px'}}>
          {showStats && <span>{result}</span>}
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
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('make')}>
                Make <span style={{ opacity: sortField === 'make' ? 1 : 0.3 }}>{sortField === 'make' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('model')}>
                Model <span style={{ opacity: sortField === 'model' ? 1 : 0.3 }}>{sortField === 'model' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('year')}>
                Year <span style={{ opacity: sortField === 'year' ? 1 : 0.3 }}>{sortField === 'year' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('price')}>
                Price <span style={{ opacity: sortField === 'price' ? 1 : 0.3 }}>{sortField === 'price' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('status')}>
                Status <span style={{ opacity: sortField === 'status' ? 1 : 0.3 }}>{sortField === 'status' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
              </th>
              <th>Actions</th>
            </tr>
            <tr>
              <td>
                <input
                  type="text"
                  placeholder="Filter"
                  value={filterMake}
                  onChange={(e) => setFilterMake(e.target.value)}
                  style={{width: '100%', padding: '4px', boxSizing: 'border-box'}}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Filter"
                  value={filterModel}
                  onChange={(e) => setFilterModel(e.target.value)}
                  style={{width: '100%', padding: '4px', boxSizing: 'border-box'}}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Filter"
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  style={{width: '100%', padding: '4px', boxSizing: 'border-box'}}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Filter"
                  value={filterPrice}
                  onChange={(e) => setFilterPrice(e.target.value)}
                  style={{width: '100%', padding: '4px', boxSizing: 'border-box'}}
                />
              </td>
              <td>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{width: '100%', padding: '4px', boxSizing: 'border-box'}}>
                  <option value="">All</option>
                  <option value="Available">Available</option>
                  <option value="Sold">Sold</option>
                </select>
              </td>
              <td></td>
            </tr>
          </thead>

          <tbody>
            {sortedCars.map((car) => (
              <Fragment key={normalizeCarId(car._id)}>
                <tr>
                  <td>{car.make}</td>
                  <td>{car.model}</td>
                  <td>{car.year}</td>
                  <td>${car.price.toLocaleString()}</td>
                  <td>{car.status}</td>
                  <td>
                    <button onClick={() => handleUpdateCar(car)}>
                      Update
                    </button>
                    <button onClick={() => { setCarToDelete(car._id); setShowDeleteConfirm(true); }}>
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

      {showDeleteConfirm && (
        <div className="delete-confirm-overlay" onKeyDown={handleDialogKeyDown}>
          <div className="delete-confirm-dialog">
            <p>Are you sure you want to delete this car?</p>
            <div className="delete-confirm-buttons">
              <button ref={yesButtonRef} onClick={() => { deleteCar(carToDelete); setShowDeleteConfirm(false); setCarToDelete(null); }}>Yes</button>
              <button ref={noButtonRef} onClick={() => { setShowDeleteConfirm(false); setCarToDelete(null); }}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CarsPage;