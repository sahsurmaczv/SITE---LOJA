import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../Assets/upload_area.svg";
import { backend_url } from "../../App";


const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: ""
  });

  // 📤 Adicionar produto
  const handleAddProduct = async () => {
    try {
      if (!image) {
        alert("Selecione uma imagem antes de enviar!");
        return;
      }

      // 1️⃣ Faz upload da imagem
      const formData = new FormData();
      formData.append("product", image);

      const uploadRes = await fetch(`${backend_url}/upload`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadData.success) {
        alert("Erro ao enviar imagem!");
        return;
      }

      // 2️⃣ Adiciona produto com URL completa da imagem
      const product = { ...productDetails, image: uploadData.image_url };

      const res = await fetch(`${backend_url}/addproduct`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("admin_token"),

        },
        body: JSON.stringify(product),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Produto adicionado com sucesso!");
        setProductDetails({
          name: "",
          description: "",
          image: "",
          category: "women",
          new_price: "",
          old_price: ""
        });
        setImage(null);
      } else {
        alert("❌ Erro ao adicionar produto!");
      }
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      alert("Erro interno ao adicionar produto.");
    }
  };

  // ✏️ Atualiza inputs
  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  return (
    <div className="addproduct">
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input type="text" name="name" value={productDetails.name} onChange={changeHandler} placeholder="Type here" />
      </div>

      <div className="addproduct-itemfield">
        <p>Product description</p>
        <input type="text" name="description" value={productDetails.description} onChange={changeHandler} placeholder="Type here" />
      </div>

      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Old Price</p>
          <input type="number" name="old_price" value={productDetails.old_price} onChange={changeHandler} placeholder="Type here" />
        </div>
        <div className="addproduct-itemfield">
          <p>New Price</p>
          <input type="number" name="new_price" value={productDetails.new_price} onChange={changeHandler} placeholder="Type here" />
        </div>
      </div>

      <div className="addproduct-itemfield">
        <p>Product category</p>
        <select name="category" value={productDetails.category} onChange={changeHandler} className="add-product-selector">
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>

      <div className="addproduct-itemfield">
        <p>Product image</p>
        <label htmlFor="file-input">
          <img className="addproduct-thumbnail-img" src={!image ? upload_area : URL.createObjectURL(image)} alt="preview" />
        </label>
        <input onChange={(e) => setImage(e.target.files[0])} type="file" name="image" id="file-input" accept="image/*" hidden />
      </div>

      <button className="addproduct-btn" onClick={handleAddProduct}>ADD</button>
    </div>
  );
};

export default AddProduct;
