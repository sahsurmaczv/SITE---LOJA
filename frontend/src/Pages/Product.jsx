// src/Pages/Product.jsx
import React, { useContext, useEffect, useState } from "react";
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import "./CSS/ProductPage.css";

const Product = () => {
  const { products } = useContext(ShopContext);
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    setProduct(products.find((e) => e.id === Number(productId)));
  }, [products, productId]);

  if (!product) return <p style={{ marginTop: "120px", textAlign: "center" }}>Carregando...</p>;

  return (
    <div className="productpage">

      {/* 🔙 Botão de voltar */}
      <button className="back-btn-product" onClick={() => navigate(-1)}>
        ⬅ Voltar
      </button>

      <ProductDisplay product={product} />
    </div>
  );
};

export default Product;
