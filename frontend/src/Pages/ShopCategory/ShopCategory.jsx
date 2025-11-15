import React, { useContext, useState } from "react";
import { ShopContext } from "../../Context/ShopContext";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./ShopCategory.css";
import { backend_url } from "../../App";
import clear_icon from "../../Components/Assets/clear.svg";

const ShopCategory = () => {
  const { products } = useContext(ShopContext);
  const { categoriaId } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const filteredProducts = products.filter(
    (p) =>
      p.category === categoriaId &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="category-page">
      <div className="category-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          Voltar
        </button>

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
              <img src={clear_icon} alt="Limpar busca" className="clear-icon" />
            </button>

          )}
        </div>
      </div>
      <h1 className="category-title">{categoriaId.toUpperCase()}</h1>
      <div className="category-products-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div className="category-product-card" key={product.id}>
              <Link
                to={`/product/${product.id}`}
                state={{ from: `/categoria/${categoriaId}` }}
              >
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
