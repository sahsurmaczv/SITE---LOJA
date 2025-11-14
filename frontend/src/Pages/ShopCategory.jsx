// src/Pages/ShopCategory.jsx
import React, { useContext, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./CSS/ShopCategory.css";
import { backend_url } from "../App";

const ShopCategory = () => {
  const { products } = useContext(ShopContext);
  const { categoriaId } = useParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  // 🔎 Filtra produtos pela categoria + nome pesquisado
  const filteredProducts = products.filter(
    (p) =>
      p.category === categoriaId &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="category-page">

      {/* CABEÇALHO */}
      <div className="category-header">
        {/* Botão Voltar */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          ⬅ Voltar
        </button>

        {/* Campo de Busca */}
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Buscar produto..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search.length > 0 && (
            <button className="clear-search" onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Título da categoria */}
      <h1 className="category-title">{categoriaId.toUpperCase()}</h1>

      {/* Produtos */}
      <div className="category-products-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div className="category-product-card" key={product.id}>
              <Link to={`/product/${product.id}`}>
                <div className="product-img-wrapper">
  <img
  src={
    product.image?.startsWith("http")
      ? product.image
      : `${backend_url}${product.image}`
  }
  alt={product.name}
/>

</div>

                <p className="product-name">{product.name}</p>
                <p className="product-price">R$ {product.new_price}</p>
              </Link>
            </div>
          ))
        ) : (
          <p className="no-products">Nenhum produto encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default ShopCategory;
