

# Car Manager

**Rohan Kumar** ([kumar.rohan1@northeastern.edu](mailto:kumar.rohan1@northeastern.edu))
**Daniel Jilek** ([jilek.d@northeastern.edu](mailto:jilek.d@northeastern.edu))

*Web Development — Spring 2026*
*Professor John Guerra*

---

#  Overview

**Car Manager** is a full-stack web application designed to simplify how car dealerships manage inventory and sales.

Instead of relying on spreadsheets or disconnected tools, this platform centralizes all operations — allowing users to:

* Track vehicles
* Record sales transactions
* Maintain accurate, real-time dealership data

---

#  Links

*  **Live App:** *(Add link)*
*  **Demo Video:** *(Add link)*
* **Slides:**
  [https://docs.google.com/presentation/d/1LvLrOHhLtmGReQEMSHt1McX6s0qMD1Y3b5akLm0p9Wc/edit?usp=sharing](g)
* **Design Document:**
  [https://docs.google.com/document/d/1NXgCjUKdv8X7MqSYT4_0Hn3ZCtJRze0rq-wCmTqM0O4/edit?usp=sharing]

---

#  Tech Stack

* **Frontend:** React (Vite)
* **Backend:** Node.js, Express
* **Database:** MongoDB

---

#  Features

## Inventory Management

* Add new vehicles
* Update car details (price, year, status)
* Delete vehicles
* View all available inventory

## Sales Tracking

* Record completed sales
* Store customer details, price, and date
* Edit or delete sales records
* Link sales to specific vehicles

---

#  Team Contributions

### Rohan Kumar — Inventory System

* Built full CRUD functionality for cars
* Managed vehicle data and updates
* Integrated frontend with backend APIs

### Daniel Jilek — Sales System

* Built full CRUD functionality for sales
* Linked sales data with car inventory
* Managed transaction records

---

#  Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/DanielRJilek/car_management.git
cd Car-Management
```

---

## 2. Install dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd ../frontend
npm install
```

---

## 3. Configure environment

Create a `.env` file in the **backend** folder:

```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

---

## 4. Run the application

### Start backend

```bash
cd backend
npm start
```

### Start frontend

```bash
cd ../frontend
npm run dev
```

---

## 5. Open the app

Frontend:

```bash
http://localhost:5173
```

Backend API:

```bash
http://localhost:3000
```

---

# Image Credits

Images used in this project were sourced from **Pexels**.

The Pexels license allows free use for personal and commercial purposes without attribution. These images were used to enhance the visual design of the application.

---

#  AI Usage

(ChatGPT) was used during development, particularly for understanding React and full-stack integration.

It helped clarify:

* How `useState` manages component state
* How `useEffect` handles data fetching
* How to connect React with an Express backend
* Why components were not re-rendering properly

### Example prompts:

* “How do React Hooks work in simple terms?”
* “Why is my component not updating after state change?”
* “How do I fetch data from Express in React?”
* “How do I update the UI after a POST request?”

---

# Screenshots


* Home Page
  <img width="1405" height="678" alt="thumbnail" src="https://github.com/user-attachments/assets/6788a571-f78c-42f8-84bd-1b0db86d3efe" />

* Cars Page
<img width="1234" height="679" alt="Screenshot 2026-03-20 at 7 39 51 AM" src="https://github.com/user-attachments/assets/520a020e-38c9-4e16-9a37-440cc755b0b3" />

  
* Sales Page

---

#  License

This project is licensed under the **MIT License**.


