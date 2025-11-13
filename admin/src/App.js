import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Footer from "./Components/Footer/Footer";
import Navbar from "./Components/Navbar/Navbar";
import Admin from "./Pages/Admin";
import AdminLogin from "./Pages/AdminLogin";
import { useEffect, useState } from "react";

export const backend_url = "http://localhost:4000";
export const currency = "$";

function App() {
  const [token, setToken] = useState(localStorage.getItem("admin_token") || null);

  // Atualiza o token se ele mudar em outra aba / após login
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("admin_token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Login → se logada vai pro painel */}
        <Route
          path="/"
          element={token ? <Navigate to="/admin" /> : <AdminLogin setToken={setToken} />}
        />
        <Route
          path="/login"
          element={<AdminLogin setToken={setToken} />}
        />
        <Route
          path="/admin/*"
          element={token ? <Admin /> : <Navigate to="/login" />}
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
