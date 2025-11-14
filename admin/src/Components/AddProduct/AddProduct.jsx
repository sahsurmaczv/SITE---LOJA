import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../Assets/upload_area.svg";
import { backend_url } from "../../App";
import { categories } from "../../data/categories";

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [dragging, setDragging] = useState(false);

  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    category: "fontes",
    new_price: ""
  });

  // =============================
  //  Máscara de moeda
  // =============================
  const formatCurrency = (value) => {
    const onlyNumbers = value.replace(/\D/g, "");
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(onlyNumbers / 100);
  };

  const changePrice = (e) => {
    const masked = formatCurrency(e.target.value);
    setProductDetails({ ...productDetails, new_price: masked });
  };

  // converter moeda "R$ 1.234,56" → 1234.56
  const currencyToNumber = (masked) => {
    return Number(masked.replace(/\./g, "").replace(",", ".").replace("R$", "").trim());
  };

  // =============================
  //  Drag & Drop
  // =============================
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) setImage(file);
  };

  const handleFileSelect = (e) => setImage(e.target.files[0]);

  // =============================
  // VALIDAR CAMPOS
  // =============================
  const validate = () => {
    if (!productDetails.name.trim()) return alert("Nome obrigatório.");
    if (!productDetails.description.trim()) return alert("Descrição obrigatória.");
    if (!productDetails.new_price) return alert("Preço obrigatório.");
    if (!image) return alert("Selecione uma imagem.");
    return true;
  };

  // =============================
  //  SALVAR PRODUTO (UPLOAD + POST)
  // =============================
  const handleSave = async () => {
    if (!validate()) return;

    try {
      // ---- upload da imagem ----
      const formData = new FormData();
      formData.append("product", image);

      const uploadRes = await fetch(`${backend_url}/upload`, {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadData.success) {
        alert("Erro ao enviar imagem.");
        return;
      }

      const finalPrice = currencyToNumber(productDetails.new_price);

      const product = {
        name: productDetails.name,
        description: productDetails.description,
        category: productDetails.category,
        image: uploadData.image_url,
        new_price: finalPrice,
        old_price: 0
      };

      // ---- enviar produto para o servidor ----
      const res = await fetch(`${backend_url}/addproduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("admin_token"),
        },
        body: JSON.stringify(product),
      });

      const data = await res.json();

      if (data.success) {
        alert("Produto cadastrado com sucesso!");

        // reset
        setImage(null);
        setProductDetails({
          name: "",
          description: "",
          category: "fontes",
          new_price: "",
        });
      } else {
        alert(data.message || "Erro ao cadastrar produto");
      }

    } catch (err) {
      console.error(err);
      alert("Erro ao salvar produto.");
    }
  };

  return (
    <div className="addproduct">
      <h2 className="admin-title">Adicionar Produto</h2>

      <div className="addproduct-grid">

        {/* COLUNA ESQUERDA */}
        <div>
          <div className="field">
            <label>Nome</label>
            <input
              name="name"
              value={productDetails.name}
              onChange={(e) =>
                setProductDetails({ ...productDetails, name: e.target.value })
              }
            />
          </div>

          <div className="field">
            <label>Categoria</label>
            <select
              name="category"
              value={productDetails.category}
              onChange={(e) =>
                setProductDetails({ ...productDetails, category: e.target.value })
              }
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Preço</label>
            <input
              name="new_price"
              value={productDetails.new_price}
              onChange={changePrice}
              placeholder="R$ 0,00"
            />
          </div>

          <div className="field">
            <label>Descrição</label>
            <textarea
              name="description"
              value={productDetails.description}
              onChange={(e) =>
                setProductDetails({ ...productDetails, description: e.target.value })
              }
            />
          </div>
        </div>

        {/* COLUNA DIREITA — UPLOAD */}
        <div>
          <label>Imagem</label>

          {!image ? (
            <div
              className={`upload-area ${dragging ? "dragover" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input").click()}
            >
              <img src={upload_area} alt="" />
              <p>Arraste a imagem aqui ou clique para enviar</p>
            </div>
          ) : (
            <div
              className="preview-box"
              onClick={() => document.getElementById("file-input").click()}
            >
              <img src={URL.createObjectURL(image)} alt="preview" />
            </div>
          )}

          <input
            id="file-input"
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileSelect}
          />
        </div>
      </div>

      <button className="btn-save" onClick={handleSave}>
        Salvar Produto
      </button>
    </div>
  );
};

export default AddProduct;
