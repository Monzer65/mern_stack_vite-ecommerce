/** @format */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";

import "./assets/styles/index.css";

// enable if statement in production
// if (process.env.NODE_ENV === "production") {
disableReactDevTools();
// }

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
