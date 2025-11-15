import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import ShopContextProvider from "./Context/ShopContext";
import { ToastProvider } from "./Components/Toast/ToastProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ToastProvider>
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
  </ToastProvider>
);
