import React from "react";
import "./Footer.css";

import instagram_icon from "../Assets/instagram_icon.svg";
import whats_icon from "../Assets/whats_icon.svg";
import facebook_icon from "../Assets/facebook_icon.svg";


const Footer = () => {
  return (
    <footer className="footer">

      {/* HORÁRIOS */}
      <div className="footer-hours">
        <h4>Horários de Atendimento</h4>
        <p>Segunda à sexta: <strong>08:30 - 11:30 / 13:00 - 18:00</strong></p>
        <p>Sábado: <strong>08:30 - 12:00</strong></p>
      </div>

      {/* ICONES */}
      <div className="footer-social-icons">
        <a href="https://instagram.com" target="_blank">
          <img src={instagram_icon} alt="Instagram" />
        </a>
        <a href="https://wa.me/5542999999999" target="_blank">
          <img src={whats_icon} alt="WhatsApp" />
        </a>
        <a href="https://facebook.com" target="_blank">
          <img src={facebook_icon} alt="Facebook" />
        </a>
      </div>

      {/* COPYRIGHT */}
      <div className="footer-copy">
        <p>© {new Date().getFullYear()} — Neri Informática. Todos os direitos reservados.</p>
      </div>

    </footer>
  );
};

export default Footer;
