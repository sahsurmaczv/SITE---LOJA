import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import { useEffect, useState } from "react";

export const backend_url = "http://localhost:4000";
export const currency = "R$";

function App() {
  const [token, setToken] = useState(localStorage.getItem("admin_token") || null);

  useEffect(() => {
    const handleStorageChange = () => setToken(localStorage.getItem("admin_token"));
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <div className="admin-main">
        <Routes>
          <Route path="/" element={token ? <Navigate to="/admin" /> : <AdminLogin setToken={setToken} />} />
          <Route path="/login" element={<AdminLogin setToken={setToken} />} />
          <Route path="/admin/*" element={token ? <Admin /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
