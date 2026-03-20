import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

function AddForm({ title, endpoint, fields, buttonLabel, onSubmit, requiresAuth = false }) {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || "";
      return acc;
    }, {})
  );

  const auth = requiresAuth ? useContext(AuthContext) : null;

  async function handleSubmit() {
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

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify(processedData),
      });

      if (response.ok) {
        // Reset form
        setFormData(
          fields.reduce((acc, field) => {
            acc[field.name] = field.defaultValue || "";
            return acc;
          }, {})
        );
        onSubmit();
      } else {
        const error = await response.json();
        console.error("Error submitting form:", response.status, error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
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

      <button onClick={handleSubmit}>{buttonLabel}</button>
    </div>
  );
}

export default AddForm;
