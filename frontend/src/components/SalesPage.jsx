import { Fragment, useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import UpdateSale from "./UpdateSale";

const API_URL = import.meta.env.VITE_API_URL;

function SalesPage() {
  const [sales, setSales] = useState([]);
  const [editingSale, setEditingSale] = useState(null);
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
      
      setSales((prevSales) => prevSales.filter((sale) => sale._id !== saleId));
      
      if (editingSale && editingSale._id === saleId) {
        setEditingSale(null);
      }
    } catch (error) {
      console.log("Error deleting sale:", error);
    }
  }

  function handleUpdateSale(sale) {
    setEditingSale(sale);
  }

  function handleCancelUpdate() {
    setEditingSale(null);
  }

  return (
    <div>
      <div className="inventory-card">
        <h1>Sales Management</h1>

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
            {sales.map((sale) => (
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
                      <UpdateSale
                        sale={editingSale}
                        onSaleUpdated={() => {
                          loadSales();
                          setEditingSale(null);
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

export default SalesPage;
