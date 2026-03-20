import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

function UpdateSale({ sale, onSaleUpdated, onCancel }) {
  const [carId, setCarId] = useState(sale.car_id);
  const [customerName, setCustomerName] = useState(sale.customer_name);
  const [salePrice, setSalePrice] = useState(sale.sale_price);
  const [salesperson, setSalesperson] = useState(sale.salesperson);
  const [saleDate, setSaleDate] = useState(sale.sale_date.split('T')[0]);
  const auth = useContext(AuthContext);

  async function handleUpdate() {
    try {
      const token = auth.accessToken;
      console.log("Auth token for update:", token);
      
      const response = await fetch(`${API_URL}/sales/${sale._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          car_id: Number(carId),
          customer_name: customerName,
          sale_price: Number(salePrice),
          salesperson: salesperson,
          sale_date: new Date(saleDate).toISOString()
        }),
      });
      if (response.ok) {
        onSaleUpdated();
      } else {
        const error = await response.json();
        console.error("Error updating sale:", response.status, error);
      }
    } catch (error) {
      console.error("Error updating sale:", error);
    }
  }

  return (
    <div className="update-form">
      <h3>Update Sale</h3>

      <input 
        placeholder="Car ID" 
        type="number"
        value={carId} 
        onChange={(e) => setCarId(e.target.value)} 
      />
      <input 
        placeholder="Customer Name" 
        value={customerName} 
        onChange={(e) => setCustomerName(e.target.value)} 
      />
      <input 
        placeholder="Sale Price" 
        type="number"
        value={salePrice} 
        onChange={(e) => setSalePrice(e.target.value)} 
      />
      <input 
        placeholder="Salesperson" 
        value={salesperson} 
        onChange={(e) => setSalesperson(e.target.value)} 
      />
      <input 
        placeholder="Sale Date" 
        type="date"
        value={saleDate} 
        onChange={(e) => setSaleDate(e.target.value)} 
      />

      <button onClick={handleUpdate}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}

export default UpdateSale;
