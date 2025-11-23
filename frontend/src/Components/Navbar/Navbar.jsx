import React, { useContext, useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart.svg";
import menu_icon from "../Assets/menu.svg";  
import { ShopContext } from "../../Context/ShopContext";

const Navbar = ({ onOpenSidebar }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { getTotalCartItems, logoutCleanup } = useContext(ShopContext);
  const toggleMobileMenu = () => setMenuOpen(!menuOpen);
  return (
    <header className="nav-container">
      <nav className="nav">
        <Link to="/" className="nav-logo">
          <img src={logo} alt="logo" />
          <span>NERI INFORMÁTICA</span>
        </Link>
        <button className="btn-sidebar" onClick={onOpenSidebar}>
          <img src={menu_icon} className="icon-menu" alt="menu" />
          Categorias
        </button>
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/#sobre">Sobre</Link></li>
          <li><Link to="/#sistema">Sistema</Link></li>
          <li><Link to="/#local">Localização</Link></li>
        </ul>
        <div className="nav-actions">
          <Link to="/cart" className="cart-wrapper">
            <img src={cart_icon} className="cart-icon" />
            <span className="cart-count">{getTotalCartItems()}</span>
          </Link>
          {localStorage.getItem("auth-token") ? (
            <button
              className="login-btn"
              onClick={() => {
                localStorage.removeItem("auth-token");
                logoutCleanup();
                window.location.reload();
              }}
            >
              Logout
            </button>
          ) : (
            <Link to="/login">
              <button className="login-btn">Login</button>
            </Link>
          )}
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            <img src={menu_icon} alt="menu mobile" className="icon-menu-mobile" />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
