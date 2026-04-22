import { Fragment, useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import UpdateForm from "./UpdateForm";
import AddForm from "./AddForm";
import "../css/Page.css";

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
  const [filterCarId, setFilterCarId] = useState("");
  const [filterSalesperson, setFilterSalesperson] = useState("");
  const [filterCustomer, setFilterCustomer] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [result, setResult] = useState("");
  const [showTotals, setShowTotals] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState(null); // null, 'asc', or 'desc'
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);
  const auth = useContext(AuthContext);
  const yesButtonRef = useRef(null);
  const noButtonRef = useRef(null);

  useEffect(() => {
    if (auth.accessToken) {
      loadSales();
    }
  }, [auth.accessToken]);

  useEffect(() => {
    if (showDeleteConfirm && yesButtonRef.current) {
      yesButtonRef.current.focus();
    }
  }, [showDeleteConfirm]);

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

  function handleDialogKeyDown(e) {
    if (e.key === 'Escape') {
      setShowDeleteConfirm(false);
      setSaleToDelete(null);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (e.target === yesButtonRef.current) {
        noButtonRef.current.focus();
      } else if (e.target === noButtonRef.current) {
        yesButtonRef.current.focus();
      }
    }
  }

  function handleHeaderKeyDown(e, field) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSort(field);
    }
  }

  function getSortAriaLabel(field) {
    if (sortField === field) {
      return `${field}: sorted ${sortDir === 'asc' ? 'ascending' : 'descending'}, press to reverse`;
    }
    return `${field}: click to sort ascending`;
  }

  function totalSales() {
    setResult(`Total Sales: ${sales.length}`);
    setShowTotals(!showTotals);
  }

  function totalRevenue() {
    const revenue = sales.reduce((sum, sale) => sum + sale.sale_price, 0);
    setResult(`Total Revenue: $${revenue.toFixed(2).toLocaleString()}`);
    setShowTotals(!showTotals);
  }

  function averageSalePrice() {
    if (sales.length === 0) {
      setResult("Average Sale Price: $0.00");
    } else {
      const total = sales.reduce((sum, sale) => sum + sale.sale_price, 0);
      const avg = total / sales.length;
      setResult(`Average Sale Price: $${avg.toFixed(2).toLocaleString()}`);
    }
    setShowTotals(!showTotals);
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

  const filteredSales = sales.filter(sale =>
    (!filterCarId || sale.car_id.toString().includes(filterCarId)) &&
    (!filterSalesperson || sale.salesperson.toLowerCase().includes(filterSalesperson.toLowerCase())) &&
    (!filterCustomer || sale.customer_name.toLowerCase().includes(filterCustomer.toLowerCase())) &&
    (!filterPrice || sale.sale_price.toString().includes(filterPrice)) &&
    (!filterDate || new Date(sale.sale_date).toLocaleDateString().includes(filterDate))
  );

  const sortedFilteredSales = [...filteredSales].sort((a, b) => {
    if (sortField === null || sortDir === null) return 0;
    
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle dates
    if (sortField === 'sale_date') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
      return sortDir === 'asc' ? aValue - bValue : bValue - aValue;
    }
    // Handle numeric values
    else if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDir === 'asc' ? aValue - bValue : bValue - aValue;
    }
    // Handle strings
    else if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
      return sortDir === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    
    return 0;
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
        </div>

        <div className="stats-display" style={{minHeight: '24px', textAlign: 'center', marginTop: '16px'}}>
          {showTotals && <span>{result}</span>}
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
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('car_id')} onKeyDown={(e) => handleHeaderKeyDown(e, 'car_id')} tabIndex={0} role="button" aria-label={getSortAriaLabel('car_id')} aria-sort={sortField === 'car_id' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                Car ID <span style={{ opacity: sortField === 'car_id' ? 1 : 0.3 }} aria-hidden="true">{sortField === 'car_id' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
              </th>
              <th style={{ cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={() => handleSort('customer_name')} onKeyDown={(e) => handleHeaderKeyDown(e, 'customer_name')} tabIndex={0} role="button" aria-label={getSortAriaLabel('customer_name')} aria-sort={sortField === 'customer_name' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                Customer Name <span style={{ opacity: sortField === 'customer_name' ? 1 : 0.3 }} aria-hidden="true">{sortField === 'customer_name' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('sale_price')} onKeyDown={(e) => handleHeaderKeyDown(e, 'sale_price')} tabIndex={0} role="button" aria-label={getSortAriaLabel('sale_price')} aria-sort={sortField === 'sale_price' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                Sale Price <span style={{ opacity: sortField === 'sale_price' ? 1 : 0.3 }} aria-hidden="true">{sortField === 'sale_price' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('salesperson')} onKeyDown={(e) => handleHeaderKeyDown(e, 'salesperson')} tabIndex={0} role="button" aria-label={getSortAriaLabel('salesperson')} aria-sort={sortField === 'salesperson' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                Salesperson <span style={{ opacity: sortField === 'salesperson' ? 1 : 0.3 }} aria-hidden="true">{sortField === 'salesperson' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('sale_date')} onKeyDown={(e) => handleHeaderKeyDown(e, 'sale_date')} tabIndex={0} role="button" aria-label={getSortAriaLabel('sale_date')} aria-sort={sortField === 'sale_date' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                Sale Date <span style={{ opacity: sortField === 'sale_date' ? 1 : 0.3 }} aria-hidden="true">{sortField === 'sale_date' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
              </th>
              <th>Actions</th>
            </tr>
            <tr>
              <td>
                <input
                  type="text"
                  placeholder="Filter"
                  value={filterCarId}
                  onChange={(e) => setFilterCarId(e.target.value)}
                  style={{width: '100%', padding: '4px', boxSizing: 'border-box'}}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Filter"
                  value={filterCustomer}
                  onChange={(e) => setFilterCustomer(e.target.value)}
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
                <input
                  type="text"
                  placeholder="Filter"
                  value={filterSalesperson}
                  onChange={(e) => setFilterSalesperson(e.target.value)}
                  style={{width: '100%', padding: '4px', boxSizing: 'border-box'}}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Filter"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  style={{width: '100%', padding: '4px', boxSizing: 'border-box'}}
                />
              </td>
              <td></td>
            </tr>
          </thead>

          <tbody>
            {sortedFilteredSales.map((sale) => (
              <Fragment key={sale._id}>
                <tr>
                  <td>{sale.car_id}</td>
                  <td>{sale.customer_name}</td>
                  <td>${sale.sale_price.toLocaleString()}</td>
                  <td>{sale.salesperson}</td>
                  <td>{new Date(sale.sale_date).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleUpdateSale(sale)}>
                      Update
                    </button>
                    <button onClick={() => { setSaleToDelete(sale._id); setShowDeleteConfirm(true); }}>
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

        {showDeleteConfirm && (
          <div className="delete-confirm-overlay" onKeyDown={handleDialogKeyDown} role="presentation">
            <div className="delete-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-dialog-title" aria-describedby="delete-dialog-desc">
              <p id="delete-dialog-title">Confirm Delete</p>
              <p id="delete-dialog-desc">Are you sure you want to delete this sale?</p>
              <div className="delete-confirm-buttons">
                <button ref={yesButtonRef} onClick={() => { deleteSale(saleToDelete); setShowDeleteConfirm(false); setSaleToDelete(null); }} aria-label="Confirm delete">Yes</button>
                <button ref={noButtonRef} onClick={() => { setShowDeleteConfirm(false); setSaleToDelete(null); }} aria-label="Cancel delete">No</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SalesPage;
