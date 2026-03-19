const { useState, useEffect } = React;

function UpdateCar() {
  const [row, setRow] = useState(null);
  const [formContainer, setFormContainer] = useState(null);

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    window.updateCar = function (button) {
      const r = button.parentElement.parentElement;
      const cells = r.querySelectorAll("td");

      setRow(r);
      setMake(cells[0].innerText);
      setModel(cells[1].innerText);
      setYear(cells[2].innerText);
      setPrice(cells[3].innerText.replace("$", ""));
      setStatus(cells[4].innerText);

      const newRow = document.createElement("tr");

      const td = document.createElement("td");
      td.colSpan = 6;

      newRow.appendChild(td);

      r.after(newRow);

      setFormContainer(td);
    };
  }, []);

  async function handleUpdate() {
    const id = row.getAttribute("data-id");

    await fetch(`http://localhost:3000/api/cars/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        make,
        model,
        year,
        price,
        status,
      }),
    });

    formContainer.parentElement.remove();
    setFormContainer(null);

    loadCars();
  }

  if (!formContainer) return null;

  return ReactDOM.createPortal(
    <div className="react-form">
      <h3>Update Car</h3>

      <input
        value={make}
        onChange={(e) => setMake(e.target.value)}
        placeholder="Make"
      />

      <input
        value={model}
        onChange={(e) => setModel(e.target.value)}
        placeholder="Model"
      />

      <input
        value={year}
        onChange={(e) => setYear(e.target.value)}
        placeholder="Year"
      />

      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
      />

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Available">Available</option>
        <option value="Sold">Sold</option>
      </select>

      <button onClick={handleUpdate}>Save</button>
    </div>,

    formContainer,
  );
}
