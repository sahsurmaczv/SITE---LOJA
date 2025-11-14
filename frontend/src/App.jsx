import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./Components/Navbar/Navbar";
import Sidebar from "./Components/Sidebar/Sidebar";

import Shop from "./Pages/Shop";
import Cart from "./Pages/Cart";
import Product from "./Pages/Product";
import Footer from "./Components/Footer/Footer";
import ShopCategory from "./Pages/ShopCategory";
import LoginSignup from "./Pages/LoginSignup";

export const backend_url = "http://localhost:4000";
export const currency = "R$";

// 🔹 Componente responsável por rolar até a seção (#sobre, #sistema, etc.)
function ScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);

      if (element) {
        setTimeout(() => {
          const navbarHeight = 70; // altura da navbar
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }, 80);
      }
    }
  }, [hash]);

  return null;
}


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>

      {/* 🔥 Ativa scroll automático para âncoras */}
      <ScrollToHash />

      <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/categoria/:categoriaId" element={<ShopCategory />} />
        </Routes>

       
      </div>
       <Footer />
    </Router>
  );
}

export default App;
