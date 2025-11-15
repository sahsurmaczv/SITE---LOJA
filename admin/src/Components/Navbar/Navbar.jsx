import React from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("admin_token");
    navigate("/login");
  };

  return (
    <header className="admin-nav-container">
      <nav className="admin-nav">

        {/* LOGO / TÍTULO */}
        <div className="admin-logo">
          <span>Painel Administrativo</span>
        </div>

        {/* LINKS */}
        <ul className="admin-nav-links">
          <li><button className="admin-link" onClick={() => navigate("/admin/listproduct")}>Produtos</button></li>
          <li><button className="admin-link" onClick={() => navigate("/admin/addproduct")}>Adicionar</button></li>
        </ul>

        {/* AÇÕES */}
        <div className="admin-actions">
          <button className="admin-logout-btn" onClick={logout}>Logout</button>
        </div>
      </nav>
    </header>
  );
};

export default AdminNavbar;
