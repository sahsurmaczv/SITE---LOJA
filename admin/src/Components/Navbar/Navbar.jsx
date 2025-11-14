import React from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("admin_token");
    navigate("/login");
  };

  return (
    <header className="admin-navbar">
      <div className="container-center nav-inner">

        <div className="nav-left">
          <span className="nav-title">Painel Admin</span>
        </div>

        <div className="nav-right">
          <button className="btn btn-ghost" onClick={() => navigate("/admin/listproduct")}>
            Produtos
          </button>

          <button className="btn btn-ghost" onClick={() => navigate("/admin/addproduct")}>
            Adicionar
          </button>

          <button className="btn logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
