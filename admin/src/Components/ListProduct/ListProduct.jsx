// src/Components/ListProduct/ListProduct.jsx
import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import { backend_url, currency } from "../../App";
import cross_icon from "../Assets/cross_icon.png";

const ListProduct = () => {
  const [all, setAll] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState(null);

  const fetchProducts = async () => {
    const res = await fetch(`${backend_url}/allproducts`);
    const data = await res.json();
    setAll(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const removeProduct = async (id) => {
    if (!window.confirm("Deseja remover este produto?")) return;

    const res = await fetch(`${backend_url}/removeproduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("admin_token"),
      },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    if (data.success) {
      fetchProducts();
    }
  };

  const openEdit = (p) => {
    setEditing({ ...p });
    setPreview(
  p.image.startsWith("http")
    ? p.image
    : `${backend_url}${p.image.startsWith("/") ? p.image : "/" + p.image}`
);

  };

  const closeEdit = () => {
    setEditing(null);
    setPreview(null);
  };

  const saveEdit = async () => {
    const res = await fetch(`${backend_url}/editproduct`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("admin_token"),
      },
      body: JSON.stringify(editing),
    });

    const data = await res.json();
    if (data.success) {
      closeEdit();
      fetchProducts();
    }
  };

  const filtered = all.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="lp-container">
      <div className="lp-header">
        <h2>Produtos Cadastrados</h2>

        <input
          className="lp-search"
          placeholder="Buscar…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Cabeçalho */}
      <div className="lp-table-head">
        <span>Imagem</span>
        <span>Produto</span>
        <span>Preço</span>
        <span>Categoria</span>
        <span>Ações</span>
      </div>

      {filtered.map((p) => (
        <div key={p.id} className="lp-row">
          <div className="lp-img-box">
            <img
  src={
    p.image?.startsWith("http")
      ? p.image
      : `${backend_url}${p.image.startsWith("/") ? p.image : "/" + p.image}`
  }
  alt=""
/>

          </div>

          <div className="lp-info">
            <span className="lp-name">{p.name}</span>
            <span className="lp-desc">{p.description}</span>
          </div>

          <span className="lp-price">{currency}{p.new_price}</span>
          <span className="lp-cat">{p.category}</span>

          <div className="lp-actions">
            <button className="lp-btn-edit" onClick={() => openEdit(p)}>
              Editar
            </button>
            <img
              src={cross_icon}
              alt="X"
              className="lp-remove"
              onClick={() => removeProduct(p.id)}
            />
          </div>
        </div>
      ))}

      {/* MODAL */}
      {editing && (
        <div className="lp-modal-overlay" onClick={closeEdit}>
          <div className="lp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="lp-modal-top">
              <h3>Editar Produto</h3>
              <button className="lp-close" onClick={closeEdit}>✕</button>
            </div>

            <div className="lp-modal-grid">

              {/* CAMPOS */}
              <div className="lp-col">
                <label>Nome</label>
                <input
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                />

                <label>Descrição</label>
                <textarea
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                />

                <label>Preço</label>
                <input
                  type="number"
                  value={editing.new_price}
                  onChange={(e) =>
                    setEditing({ ...editing, new_price: e.target.value })
                  }
                />

                <label>Categoria</label>
                <input
                  value={editing.category}
                  onChange={(e) =>
                    setEditing({ ...editing, category: e.target.value })
                  }
                />

                <button className="lp-save" onClick={saveEdit}>
                  Salvar alterações
                </button>
              </div>

              {/* IMAGEM */}
              <div className="lp-col img-col">
                <label>Preview da imagem</label>
                <img className="lp-preview" src={preview} alt="preview" />
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListProduct;
