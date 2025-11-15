import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Admin from "./Pages/Admin/Admin";
import AdminLogin from "./Pages/AdminLogin/AdminLogin";
import { useEffect, useState } from "react";
import { ToastProvider } from "./Components/Toast/ToastProvider";

export const backend_url = "http://localhost:4000";
export const currency = "R$";

function App() {
  const [token, setToken] = useState(localStorage.getItem("admin_token") || null);

  useEffect(() => {
    const handleStorageChange = () =>
      setToken(localStorage.getItem("admin_token"));
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
  <ToastProvider>
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* rota pública de login - sem wrapper .admin-main */}
        <Route
          path="/"
          element={
            token ? <Navigate to="/admin" /> : <AdminLogin setToken={setToken} />
          }
        />
        <Route path="/login" element={<AdminLogin setToken={setToken} />} />

        {/* ROTEAS DO ADMIN com wrapper .admin-main */}
        <Route
          path="/admin/*"
          element={
            token ? (
              <div className="admin-main">
                <Admin />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  </ToastProvider>
);

}

export default App;
