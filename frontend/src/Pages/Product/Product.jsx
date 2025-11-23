import React, { useContext, useEffect, useState } from "react";
import ProductDisplay from "../../Components/ProductDisplay/ProductDisplay";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import "./Product.css";

const Product = () => {
  const { products } = useContext(ShopContext);
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  useEffect(() => {
    setProduct(products.find((e) => e.id === Number(productId)));
  }, [products, productId]);
  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate("/");
    }
  };
  if (!product)
    return (
      <p style={{ marginTop: "120px", textAlign: "center" }}>Carregando...</p>
    );
  return (
    <div className="productpage">
      <button className="back-btn-product" onClick={handleBack}>
        Voltar
      </button>
      <ProductDisplay product={product} />
    </div>
  );
};

export default Product;
