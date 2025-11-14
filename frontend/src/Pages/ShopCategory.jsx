import React, { useEffect, useState } from "react";
import "./CSS/ShopCategory.css";
import Item from "../Components/Item/Item";
import { Link, useParams } from "react-router-dom";

const ShopCategory = () => {
  const { categoriaId } = useParams(); // pega a categoria da URL
  const [allproducts, setAllProducts] = useState([]);

  const fetchInfo = () => { 
    fetch('http://localhost:4000/allproducts')
      .then((res) => res.json())
      .then((data) => setAllProducts(data));
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <div className="shopcategory">

      {/* Título baseado na categoria */}
      <h2 className="shopcategory-title">
        {categoriaId.replace("-", " ").toUpperCase()}
      </h2>

      <div className="shopcategory-indexSort">
        <p><span>Mostrando produtos</span></p>
        <div className="shopcategory-sort">
          Ordenar por  
        </div>
      </div>

      <div className="shopcategory-products">
        {allproducts
          .filter(item => item.category === categoriaId)
          .map((item, i) => (
            <Item
              id={item.id}
              key={i}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          ))}
      </div>

      <div className="shopcategory-loadmore">
        <Link to="/" style={{ textDecoration: 'none' }}>Voltar</Link>
      </div>
    </div>
  );
};

export default ShopCategory;
