import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="sidebar-close" onClick={onClose}>×</button>
        <h3 className="sidebar-title">Categorias</h3>
        <div className="sidebar-section">
          <p className="sidebar-group-title">Componentes para PC</p>
          <ul>
            <li><Link to="/categoria/fontes" onClick={onClose}>Fontes</Link></li>
            <li><Link to="/categoria/gabinetes" onClick={onClose}>Gabinetes</Link></li>
            <li><Link to="/categoria/memorias" onClick={onClose}>Memórias RAM</Link></li>
            <li><Link to="/categoria/gpu" onClick={onClose}>Placas de Vídeo</Link></li>
            <li><Link to="/categoria/placamae" onClick={onClose}>Placa Mãe</Link></li>
            <li><Link to="/categoria/processadores" onClick={onClose}>Processadores</Link></li>
            <li><Link to="/categoria/refrigeracao" onClick={onClose}>Refrigeração</Link></li>
            <li><Link to="/categoria/ssd" onClick={onClose}>SSD</Link></li>
          </ul>
        </div>
        <div className="sidebar-section">
          <p className="sidebar-group-title">Conectividade & Redes</p>
          <ul>
            <li><Link to="/categoria/adaptadores" onClick={onClose}>Adaptadores</Link></li>
            <li><Link to="/categoria/repetidores" onClick={onClose}>Repetidores</Link></li>
            <li><Link to="/categoria/roteadores" onClick={onClose}>Roteadores</Link></li>
            <li><Link to="/categoria/switches" onClick={onClose}>Switches</Link></li>
          </ul>
        </div>
        <div className="sidebar-section">
          <p className="sidebar-group-title">Periféricos</p>
          <ul>
            <li><Link to="/categoria/caixasom" onClick={onClose}>Caixa de Som</Link></li>
            <li><Link to="/categoria/controles" onClick={onClose}>Controles</Link></li>
            <li><Link to="/categoria/fones" onClick={onClose}>Fones de Ouvido</Link></li>
            <li><Link to="/categoria/mouses" onClick={onClose}>Mouses</Link></li>
            <li><Link to="/categoria/mousepads" onClick={onClose}>Mousepads</Link></li>
            <li><Link to="/categoria/teclados" onClick={onClose}>Teclados</Link></li>
          </ul>
        </div>
        <div className="sidebar-section">
          <p className="sidebar-group-title">Portáteis & Acessórios</p>
          <ul>
            <li><Link to="/categoria/bolsas" onClick={onClose}>Bolsas e Cases</Link></li>
            <li><Link to="/categoria/carregadores" onClick={onClose}>Carregadores USB</Link></li>
            <li><Link to="/categoria/casehd" onClick={onClose}>Case para HD</Link></li>
            <li><Link to="/categoria/pendrives" onClick={onClose}>Pendrives</Link></li>
          </ul>
        </div>
        <div className="sidebar-section">
          <p className="sidebar-group-title">Suportes</p>
          <ul>
            <li><Link to="/categoria/suportecpu" onClick={onClose}>Suporte para CPU</Link></li>
            <li><Link to="/categoria/suportemonitor" onClick={onClose}>Suporte para Monitor</Link></li>
            <li><Link to="/categoria/suportenotebook" onClick={onClose}>Suporte para Notebook</Link></li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
