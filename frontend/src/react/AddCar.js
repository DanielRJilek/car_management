const { useState } = React;

function AddCar() {
  const [showForm, setShowForm] = useState(false);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");

  async function handleSubmit() {
    await fetch("http://localhost:3000/api/cars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        make,
        model,
        year,
        price,
      }),
    });

    setMake("");
    setModel("");
    setYear("");
    setPrice("");

    setShowForm(false);

    loadCars();
  }

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)}>Add Car</button>

      {showForm && (
        <div className="react-form">
          <input
            placeholder="Make"
            value={make}
            onChange={(e) => setMake(e.target.value)}
          />

          <input
            placeholder="Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />

          <input
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />

          <input
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
}
