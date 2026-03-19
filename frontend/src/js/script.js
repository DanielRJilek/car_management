function loadCars() {
  fetch("http://localhost:3000/api/cars")
    .then((response) => response.json())
    .then((data) => {
      const table = document.getElementById("car-table-body");
      table.innerHTML = "";

      data.forEach((car) => {
        const row = document.createElement("tr");

        row.setAttribute("data-id", car._id);

        row.innerHTML = `
          <td>${car.make}</td>
          <td>${car.model}</td>
          <td>${car.year}</td>
          <td>$${car.price}</td>
          <td>${car.status}</td>
          <td>
            <button onclick="updateCar(this)">Update</button>
            <button onclick="deleteCar(this)">Delete</button>
          </td>
        `;

        table.appendChild(row);
      });
    })
    .catch((error) => console.log("Error loading cars:", error));
}

async function addCar() {
  const make = document.getElementById("make").value;
  const model = document.getElementById("model").value;
  const year = document.getElementById("year").value;
  const price = document.getElementById("price").value;

  await fetch("http://localhost:3000/api/cars", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ make, model, year, price }),
  });

  loadCars();
}

async function deleteCar(button) {
  let row = button.parentNode.parentNode;
  const id = row.getAttribute("data-id");

  await fetch(`http://localhost:3000/api/cars/${id}`, {
    method: "DELETE",
  });

  row.remove();
}

function updateCar(button) {
  const row = button.parentNode.parentNode;

  const make = row.children[0].innerText;
  const model = row.children[1].innerText;
  const year = row.children[2].innerText;
  const price = row.children[3].innerText.replace("$", "");

  const formRow = document.createElement("tr");

  formRow.innerHTML = `
    <td><input id="editMake" value="${make}"></td>
    <td><input id="editModel" value="${model}"></td>
    <td><input id="editYear" value="${year}"></td>
    <td><input id="editPrice" value="${price}"></td>
    <td colspan="2">
      <button onclick="saveUpdate(this)">Save</button>
    </td>
  `;

  row.parentNode.insertBefore(formRow, row.nextSibling);
}

async function saveUpdate(button) {
  const formRow = button.closest("tr");
  const row = formRow.previousElementSibling;

  const id = row.getAttribute("data-id");

  const make = document.getElementById("editMake").value;
  const model = document.getElementById("editModel").value;
  const year = document.getElementById("editYear").value;
  const price = document.getElementById("editPrice").value;

  await fetch(`http://localhost:3000/api/cars/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ make, model, year, price }),
  });

  const cells = row.querySelectorAll("td");

  cells[0].innerText = make;
  cells[1].innerText = model;
  cells[2].innerText = year;
  cells[3].innerText = "$" + price;

  formRow.remove();
}

function totalCars() {
  let rows = document.querySelectorAll("tbody tr");
  document.getElementById("result").innerText = "Total Cars: " + rows.length;
}

function totalAvailable() {
  let rows = document.querySelectorAll("tbody tr");
  let count = 0;

  rows.forEach((row) => {
    let status = row.children[4].innerText;
    if (status === "Available") count++;
  });

  document.getElementById("result").innerText =
    "Total Available Cars: " + count;
}

function totalSold() {
  let rows = document.querySelectorAll("tbody tr");
  let count = 0;

  rows.forEach((row) => {
    let status = row.children[4].innerText;
    if (status === "Sold") count++;
  });

  document.getElementById("result").innerText = "Total Sold Cars: " + count;
}

document.addEventListener("DOMContentLoaded", loadCars);
