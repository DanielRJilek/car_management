import { Fragment, useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import UpdateForm from "./UpdateForm";
import AddForm from "./AddForm";

const API_URL = import.meta.env.VITE_API_URL;

const SALE_FIELDS = [
  { name: "car_id", type: "number", placeholder: "Car ID", defaultValue: "" },
  { name: "customer_name", type: "text", placeholder: "Customer Name", defaultValue: "" },
  { name: "sale_price", type: "number", placeholder: "Sale Price", defaultValue: "" },
  { name: "salesperson", type: "text", placeholder: "Salesperson", defaultValue: "" },
  { name: "sale_date", type: "date", placeholder: "Sale Date", defaultValue: "" }
];

const UPDATE_SALE_FIELDS = [
  { name: "car_id", type: "number", placeholder: "Car ID" },
  { name: "customer_name", type: "text", placeholder: "Customer Name" },
  { name: "sale_price", type: "number", placeholder: "Sale Price" },
  { name: "salesperson", type: "text", placeholder: "Salesperson" },
  { name: "sale_date", type: "date", placeholder: "Sale Date" }
];

function SalesPage() {
  const [sales, setSales] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [filterSalesperson, setFilterSalesperson] = useState("");
  const [filterCustomer, setFilterCustomer] = useState("");
  const [result, setResult] = useState("");
  const [showTotals, setShowTotals] = useState(false);
  const [sortPrice, setSortPrice] = useState(null); // null, 'asc', or 'desc'
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (auth.accessToken) {
      loadSales();
    }
  }, [auth.accessToken]);

  async function loadSales() {
    try {
      const token = auth.accessToken;
      const response = await fetch(`${API_URL}/sales`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      const sortedData = data.reverse();
      setSales(sortedData);
    } catch (error) {
      console.log("Error loading sales:", error);
    }
  }

  async function deleteSale(saleId) {
    try {
      const token = auth.accessToken;
      const response = await fetch(`${API_URL}/sales/${saleId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        try {
          const error = await response.json();
          console.log("Delete request failed on server:", response.status, error);
        } catch (e) {
          const text = await response.text();
          console.log("Delete request failed on server:", response.status, text);
        }
        return;
      }
      
      loadSales();
      setEditingSale(null);
    } catch (error) {
      console.log("Error deleting sale:", error);
    }
  }

  function handleUpdateSale(sale) {
    if (editingSale && editingSale._id === sale._id) {
      setEditingSale(null);
    } else {
      setEditingSale(sale);
    }
  }

  function totalSales() {
    setResult(`Total Sales: ${sales.length}`);
    setShowTotals(!showTotals);
  }

  function totalRevenue() {
    const revenue = sales.reduce((sum, sale) => sum + sale.sale_price, 0);
    setResult(`Total Revenue: $${revenue.toFixed(2)}`);
    setShowTotals(!showTotals);
  }

  function averageSalePrice() {
    if (sales.length === 0) {
      setResult("Average Sale Price: $0.00");
    } else {
      const total = sales.reduce((sum, sale) => sum + sale.sale_price, 0);
      const avg = total / sales.length;
      setResult(`Average Sale Price: $${avg.toFixed(2)}`);
    }
    setShowTotals(!showTotals);
  }

  function sortSalesByPrice() {
    if (sortPrice === null) {
      setSortPrice('asc');
    } else if (sortPrice === 'asc') {
      setSortPrice('desc');
    } else {
      setSortPrice(null);
    }
  }

  const filteredSales = sales.filter(sale =>
    (!filterSalesperson || sale.salesperson.toLowerCase().includes(filterSalesperson.toLowerCase())) &&
    (!filterCustomer || sale.customer_name.toLowerCase().includes(filterCustomer.toLowerCase()))
  );

  const sortedFilteredSales = [...filteredSales].sort((a, b) => {
    if (sortPrice === null) return 0;
    const priceDiff = a.sale_price - b.sale_price;
    return sortPrice === 'asc' ? priceDiff : -priceDiff;
  });

  return (
    <div>
      <div className="inventory-card">
        <h1>Sales Management</h1>

        <div className="inventory-controls">
          <button onClick={() => setShowAddForm(!showAddForm)}>Add Sale</button>

          <button onClick={totalSales}>Total Sales</button>
          <button onClick={totalRevenue}>Total Revenue</button>
          <button onClick={averageSalePrice}>Average Sale Price</button>

          <button onClick={sortSalesByPrice}>
            Sort by Price {sortPrice === 'asc' ? '↑' : sortPrice === 'desc' ? '↓' : ''}
          </button>

          {showTotals && <span>{result}</span>}
          
          <input
            placeholder="Filter by Salesperson"
            value={filterSalesperson}
            onChange={(e) => setFilterSalesperson(e.target.value)}
          />
          
          <input
            placeholder="Filter by Customer Name"
            value={filterCustomer}
            onChange={(e) => setFilterCustomer(e.target.value)}
          />
        </div>

        {showAddForm && (
          <AddForm
            title="Add New Sale"
            endpoint="/sales"
            fields={SALE_FIELDS}
            buttonLabel="Add Sale"
            onSubmit={() => { loadSales(); setShowAddForm(false); }}
            requiresAuth={true}
          />
        )}

        <table>
          <thead>
            <tr>
              <th>Car ID</th>
              <th>Customer Name</th>
              <th>Sale Price</th>
              <th>Salesperson</th>
              <th>Sale Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedFilteredSales.map((sale) => (
              <Fragment key={sale._id}>
                <tr>
                  <td>{sale.car_id}</td>
                  <td>{sale.customer_name}</td>
                  <td>${sale.sale_price}</td>
                  <td>{sale.salesperson}</td>
                  <td>{new Date(sale.sale_date).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleUpdateSale(sale)}>
                      Update
                    </button>
                    <button onClick={() => deleteSale(sale._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
                {editingSale && editingSale._id === sale._id && (
                  <tr>
                    <td colSpan="6">
                      <UpdateForm
                        title="Update Sale"
                        item={editingSale}
                        itemId={editingSale._id}
                        endpoint="/sales"
                        fields={UPDATE_SALE_FIELDS}
                        buttonLabel="Save"
                        onSubmit={() => {
                          loadSales();
                          setEditingSale(null);
                        }}
                        requiresAuth={true}
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

export default SalesPage;
