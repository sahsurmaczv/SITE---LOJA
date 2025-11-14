import React, { useContext, useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import logo from "../Assets/logo.png";
import { ShopContext } from "../../Context/ShopContext";

const Navbar = ({ onOpenSidebar }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { getTotalCartItems } = useContext(ShopContext);

  const toggleMobileMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="nav-container">
      <nav className="nav">

        <Link to="/" className="nav-logo">
          <img src={logo} alt="logo" />
          <span>NERI INFORMÁTICA</span>
        </Link>

        <button className="btn-sidebar" onClick={onOpenSidebar}>
          ☰ Categorias
        </button>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li><a href="/">Home</a></li>
          <li><Link to="/#sobre">Sobre</Link></li>
<li><Link to="/#sistema">Sistema</Link></li>
<li><Link to="/#local">Localização</Link></li>

        </ul>

        <div className="nav-actions">

          <Link to="/cart" className="cart-wrapper">
            <span className="cart-count">{getTotalCartItems()}</span>
          </Link>

          {localStorage.getItem("auth-token") ? (
            <button
              className="login-btn"
              onClick={() => {
                localStorage.removeItem("auth-token");
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
            ☰
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
