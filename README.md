Car Manager

Rohan Kumar ([kumar.rohan1@northeastern.edu] Daniel Jilek ([jilek.d@northeastern.edu]

Web Development — Spring 2026 Professor John Guerra

What is Car Manager?
Car Manager is a full-stack web application designed to simplify how car dealerships manage their inventory and sales.

Instead of juggling spreadsheets or disconnected systems, this platform brings everything into one place — allowing users to track vehicles, record transactions, and maintain accurate dealership data in real time.

Live Link : (Add link)
Demo Video: (Add link)
Slides: https://docs.google.com/presentation/d/1LvLrOHhLtmGReQEMSHt1McX6s0qMD1Y3b5akLm0p9Wc/edit?usp=sharing
Design Document: https://docs.google.com/document/d/1NXgCjUKdv8X7MqSYT4_0Hn3ZCtJRze0rq-wCmTqM0O4/edit?usp=sharing
Image Credits

The image used in this project were sourced from Pexels. The Pexels license allows for personal and commercial use without attribution. It was used to enhance the visual presentation of the application.

Tech Stack

Frontend - React | Backend - Node.js, Express | Database - MongoDB |

Inventory Management
Add new vehicles to the system
Update car details (price, mileage, status)
Remove cars from inventory
View all available vehicles
Sales Tracking
Record completed sales
Store customer info, price, and date
Edit or remove sales records
Link sales to specific cars
Rohan Kumar — Inventory System
Built full CRUD functionality for cars
Managed vehicle data and updates
Integrated frontend with backend APIs
Daniel Jilek — Sales System
Built full CRUD functionality for sales
Linked sales data to car inventory
Managed transaction records
How to Use
Open the application in your browser

Go to the Cars section

Add, edit, or delete vehicles
Navigate to the Sales section

Record a new sale
View or update transactions
Getting Started
1. Clone the Repository
git clone https://github.com/rohannes220/Car-Management.git
cd Car-Management
2. Install Dependencies
npm install
3. Configure Environment
Create a .env file:

MONGO_URI=your_mongodb_connection_string
PORT=3000
4. Run the Server
npm start
5. Launch App
Open:

http://localhost:3000
AI Usage
AI (ChatGPT) was used as a learning assistant during development, particularly for understanding how to use React Hooks and integrate them into the application.

It helped clarify:

How useState manages component state
How useEffect handles data fetching and updates
How to connect the React frontend with the Express backend
Why certain components were not re-rendering properly
Example Prompts
“How do React Hooks work in simple terms?”
“Why is my component not updating after state change?”
“How do I fetch data from Express in React?”
“How do I update the UI after a POST request?”
Screenshots
Home Page

Cars Page


Sales Page
License
This project is licensed under the MIT License.
