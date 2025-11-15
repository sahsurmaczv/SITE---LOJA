import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../Assets/upload_area.svg";
import { backend_url } from "../../App";
import { categories } from "../../data/categories";
import { useToast } from "../../Components/Toast/ToastProvider";

const AddProduct = () => {
  const { showToast } = useToast();

  const [image, setImage] = useState(null);
  const [dragging, setDragging] = useState(false);

  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    category: "fontes",
    new_price: ""
  });

  // MÁSCARA DE PREÇO
  const formatCurrency = (value) => {
    const only = value.replace(/\D/g, "");
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(only / 100);
  };

  const changePrice = (e) => {
    setProductDetails({
      ...productDetails,
      new_price: formatCurrency(e.target.value)
    });
  };

  // Converte "R$ 19,90" → 19.90
  const currencyToNumber = (masked) => {
    return Number(
      masked.replace("R$", "").replace(/\./g, "").replace(",", ".").trim()
    );
  };

  // ======================
  // DRAG & DROP
  // ======================
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setImage(f);
  };

  const handleSelect = (e) => setImage(e.target.files[0]);

  // ======================
  // VALIDAR CAMPOS
  // ======================
  const validate = () => {
    if (!productDetails.name.trim())
      return showToast("Nome obrigatório.", "error");

    if (!productDetails.description.trim())
      return showToast("Descrição obrigatória.", "error");

    if (!productDetails.new_price)
      return showToast("Preço obrigatório.", "error");

    if (!image)
      return showToast("Selecione uma imagem do produto.", "warning");

    return true;
  };

  // ======================
  // SALVAR PRODUTO
  // ======================
  const handleSave = async () => {
    if (!validate()) return;

    try {
      // upload da imagem
      const form = new FormData();
      form.append("product", image);

      const uploadRes = await fetch(`${backend_url}/upload`, {
        method: "POST",
        body: form,
      });

      const uploadData = await uploadRes.json();

      if (!uploadData.success)
        return showToast("Erro ao enviar imagem.", "error");

      const finalPrice = currencyToNumber(productDetails.new_price);

      const product = {
        name: productDetails.name,
        description: productDetails.description,
        image: uploadData.image_url,
        category: productDetails.category,
        new_price: finalPrice,
        old_price: 0,
      };

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
        showToast("Produto cadastrado com sucesso!", "success");

        // reset
        setImage(null);
        setProductDetails({
          name: "",
          description: "",
          category: "fontes",
          new_price: "",
        });
      } else {
        showToast(data.message || "Erro ao cadastrar produto", "error");
      }

    } catch (err) {
      console.error(err);
      showToast("Erro ao salvar produto.", "error");
    }
  };

  return (
    <div className="addproduct-page">
      <div className="addproduct animated-up">
        <h2 className="admin-title">Adicionar Produto</h2>

        <div className="addproduct-grid">
          {/* COLUNA 1 */}
          <div>
            <div className="field">
              <label>Nome</label>
              <input
                value={productDetails.name}
                onChange={(e) =>
                  setProductDetails({ ...productDetails, name: e.target.value })
                }
              />
            </div>

            <div className="field">
              <label>Categoria</label>
              <select
                value={productDetails.category}
                onChange={(e) =>
                  setProductDetails({
                    ...productDetails,
                    category: e.target.value,
                  })
                }
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Preço</label>
              <input
                value={productDetails.new_price}
                onChange={changePrice}
                placeholder="R$ 0,00"
              />
            </div>

            <div className="field">
              <label>Descrição</label>
              <textarea
                value={productDetails.description}
                onChange={(e) =>
                  setProductDetails({
                    ...productDetails,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* COLUNA 2 - UPLOAD */}
          <div>
            <label>Imagem</label>

            {!image ? (
              <div
                className={`upload-area ${dragging ? "dragover" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-input").click()}
              >
                <img src={upload_area} alt="" />
                <p>Arraste ou clique para enviar</p>
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
              hidden
              accept="image/*"
              onChange={handleSelect}
            />
          </div>
        </div>

        <button className="btn-save" onClick={handleSave}>
          Salvar Produto
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
