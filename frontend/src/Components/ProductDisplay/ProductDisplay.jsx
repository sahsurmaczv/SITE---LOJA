import React, { useContext } from "react";
import "./ProductDisplay.css";
import { ShopContext } from "../../Context/ShopContext";
import { backend_url, currency } from "../../App";

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  if (!product) return <p>Carregando...</p>;
  return (
    <div className="pd-container">
      <div className="pd-left">
        <img
          className="pd-image"
          src={
            product.image?.startsWith("http")
              ? product.image
              : `${backend_url}${product.image}`
          }
          alt={product.name}
        />
      </div>
      <div className="pd-right">
        <h1 className="pd-title">{product.name}</h1>
        <p className="pd-price">
          {currency}
          {Number(product.new_price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </p>
        <p className="pd-description">{product.description}</p>
        <button className="pd-btn" onClick={() => addToCart(product.id)}>
          Adicionar ao Carrinho
        </button>
        <p className="pd-category">
          Categoria: <span>{product.category}</span>
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
