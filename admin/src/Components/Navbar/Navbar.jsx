import React from "react";
import "./Navbar.css";
import navlogo from "../Assets/nav-logo.svg";
import navprofileIcon from "../Assets/nav-profile.svg";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <img src={navlogo} className="nav-logo" alt="logo" />
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <img src={navprofileIcon} className="nav-profile" alt="profile" />
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
