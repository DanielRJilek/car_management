import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import PropTypes from "prop-types";

const API_URL = import.meta.env.VITE_API_URL;

function UpdateForm({ title, item, itemId, endpoint, fields, buttonLabel, onSubmit, requiresAuth = false }) {
  // Initialize form data from the item being edited
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => {
      let value = item[field.name];
      // Handle date fields - extract just the date part
      if (field.type === "date" && value && typeof value === "string") {
        value = value.split('T')[0];
      }
      acc[field.name] = value || "";
      return acc;
    }, {})
  );

  const auth = requiresAuth ? useContext(AuthContext) : null;

  async function handleUpdate() {
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (requiresAuth && auth?.accessToken) {
        headers["Authorization"] = `Bearer ${auth.accessToken}`;
      }

      // Process form data (convert types if needed)
      const processedData = { ...formData };
      fields.forEach((field) => {
        if (field.type === "number") {
          processedData[field.name] = Number(processedData[field.name]);
        } else if (field.type === "date") {
          processedData[field.name] = new Date(processedData[field.name]).toISOString();
        }
      });

      const response = await fetch(`${API_URL}${endpoint}/${itemId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(processedData),
      });

      if (response.ok) {
        onSubmit();
      } else {
        const error = await response.json();
        console.error("Error updating item:", response.status, error);
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  }

  function handleInputChange(fieldName, value) {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  }

  return (
    <div className="update-form">
      {title && <h3>{title}</h3>}

      {fields.map((field) => {
        if (field.type === "select") {
          return (
            <select
              key={field.name}
              value={formData[field.name]}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
            >
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        }

        return (
          <input
            key={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
          />
        );
      })}

      <button onClick={handleUpdate}>{buttonLabel}</button>
    </div>
  );
}

UpdateForm.propTypes = {
  title: PropTypes.string,
  item: PropTypes.object.isRequired,
    itemId: PropTypes.string.isRequired,
    endpoint: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            placeholder: PropTypes.string,
            options: PropTypes.arrayOf(PropTypes.string),
        })
    ).isRequired,
    buttonLabel: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    requiresAuth: PropTypes.bool,
};

export default UpdateForm;
