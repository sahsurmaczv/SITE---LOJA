import React from "react";
import "./Footer.css";
import instagram_icon from "../Assets/instagram_icon.svg";
import whats_icon from "../Assets/whats_icon.svg";
import facebook_icon from "../Assets/facebook_icon.svg";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-hours">
        <h4>Horários de Atendimento</h4>
        <p>Segunda à sexta: <strong>08:30 - 11:30 / 13:00 - 18:00</strong></p>
        <p>Sábado: <strong>08:30 - 12:00</strong></p>
      </div>
      <div className="footer-social-icons">
       <a href="https://www.instagram.com/neriinformatica?igsh=MW0zejl2dTcyYnMwbg==" target="_blank" rel="noopener noreferrer">
          <img src={instagram_icon} alt="Instagram" />
        </a>
        <a href="https://wa.me/5542991234394" target="_blank" rel="noopener noreferrer">
          <img src={whats_icon} alt="WhatsApp" />
        </a>
        <a href="https://www.facebook.com/share/17hq6EwWDj/" target="_blank" rel="noopener noreferrer">
          <img src={facebook_icon} alt="Facebook" />
        </a>
      </div>
      <div className="footer-copy">
        <p>© {new Date().getFullYear()} — Neri Informática. Todos os direitos reservados.</p>
      </div>

    </footer>
  );
};

export default Footer;
