import React from "react";
import "./CSS/Shop.css";


const Shop = () => {
  return (
    <div className="home">

      {/* HERO / BANNER */}
      <section className="home-banner">
        <div className="home-banner-content">
          <h1 className="hero-title">Responsabilidade, Qualidade e Tecnologia</h1>
          <p className="hero-subtitle">Soluções completas para você e sua empresa.</p>
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="home-section fade-in">
        <h2 className="section-title-main">Sobre a Neri Informática</h2>

        <p className="subtitle">
          Priorizamos responsabilidade, pontualidade e qualidade em todos os nossos serviços.
        </p>

        <p className="section-text">
          Oferecemos atendimento especializado, manutenção de qualidade,
          venda de peças, notebooks e automação comercial, sempre buscando
          entregar a melhor experiência aos nossos clientes.
        </p>

        <h3 className="section-title">O que fazemos?</h3>

<div className="services-grid">
  <div className="service-card">
    <span className="service-icon">💻</span>
    <p>Formatação de computadores e notebooks</p>
  </div>

  <div className="service-card">
    <span className="service-icon">🛠️</span>
    <p>Manutenção em geral</p>
  </div>

  <div className="service-card">
    <span className="service-icon">🖥️</span>
    <p>Venda de peças e computadores</p>
  </div>

  <div className="service-card">
    <span className="service-icon">⌨️</span>
    <p>Troca de tela e teclado de notebook</p>
  </div>

  <div className="service-card">
    <span className="service-icon">🏢</span>
    <p>Sistema de automação comercial</p>
  </div>
  <div className="service-card">
    <span className="service-icon">🏢</span>
    <p>Serviço com qualidade e pontualidade</p>
  </div>
</div>

      </section>

      {/* SISTEMA */}
      <section id="sistema" className="home-section fade-in">
        <h2 className="section-title-main">Automação Inteligente para Empresas</h2>

        <p className="section-text">
          Somos parceiros da <strong>DESKTOPi Sistemas e Automação</strong>,
          oferecendo soluções modernas e completas para empresas de todos os tamanhos.
        </p>

        <h3 className="section-title">Principais recursos do sistema</h3>

        <ul className="system-list">
          <li>
            <strong>Controle de Estoque:</strong> Cadastre, acompanhe e otimize seu estoque.
          </li>
          <li>
            <strong>Gestão Financeira:</strong> Controle de vendas, despesas, lucros e relatórios.
          </li>
          <li>
            <strong>Relatórios Inteligentes:</strong> Dados completos para decisões estratégicas.
          </li>
          <li>
            <strong>Emissão de NF-e:</strong> Segurança e conformidade com a legislação.
          </li>
        </ul>

        <p className="call-to-action">
          Deseja impulsionar sua empresa? Fale conosco para uma demonstração gratuita!
        </p>
      </section>

      {/* LOCALIZAÇÃO */}
      <section id="local" className="home-section fade-in">
        <h2 className="section-title-main">Onde Estamos</h2>

        <p className="section-text">
          Venha conhecer nossa loja e falar com nossos especialistas.
        </p>

        <div className="map-container">
          <iframe
            title="Mapa"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3594.311007163016!2d-50.790579124806!3d-25.72722674471798!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94e631409a078863%3A0x2044bad1af3c174a!2sNeri%20Inform%C3%A1tica!5e0!3m2!1spt-BR!2sbr!4v1695145151710!5m2!1spt-BR!2sbr"
            loading="lazy"
            className="contact-map"
          ></iframe>
        </div>
      </section>

    </div>
  );
};

export default Shop;
