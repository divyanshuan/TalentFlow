import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { seedDatabase } from "./data/seedData";

// Initialize database
async function initializeApp() {
  // Seed database with sample data
  await seedDatabase();
  console.log("Database seeded successfully");
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

initializeApp().then(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
