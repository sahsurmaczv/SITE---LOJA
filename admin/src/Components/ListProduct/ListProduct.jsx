// src/Components/ListProduct/ListProduct.jsx
import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import { backend_url, currency } from "../../App";
import cross_icon from "../Assets/clear.svg";
import { useToast } from "../../Components/Toast/ToastProvider";
import { categories } from "../../data/categories";

const ListProduct = () => {
  const { showToast } = useToast();

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

  // CONFIRMAÇÃO COM TOAST
  const confirmRemove = (id) => {
    showToast(
      "Deseja remover este produto?",
      "warning",
      [
        { label: "Cancelar", type: "cancel" },
        {
          label: "Remover",
          type: "confirm",
          onClick: () => removeProduct(id),
        },
      ]
    );
  };

  // REMOVER PRODUTO
  const removeProduct = async (id) => {
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
      showToast("Produto removido com sucesso!", "success");
      fetchProducts();
    } else {
      showToast(data.message || "Erro ao remover produto", "error");
    }
  };

  // ABRIR EDIÇÃO
  const openEdit = (p) => {
    setEditing({ ...p });

    setPreview(
      p.image.startsWith("http")
        ? p.image
        : `${backend_url}${p.image.startsWith("/") ? p.image : "/" + p.image
        }`
    );
  };

  // FECHAR MODAL
  const closeEdit = () => {
    setEditing(null);
    setPreview(null);
  };

  // SALVAR EDIÇÃO
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
      showToast("Alterações salvas!", "success");
      closeEdit();
      fetchProducts();
    } else {
      showToast(data.message || "Erro ao salvar alterações", "error");
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
                  : `${backend_url}${p.image.startsWith("/") ? p.image : "/" + p.image
                  }`
              }
              alt=""
            />
          </div>

          <div className="lp-info">
            <span className="lp-name">{p.name}</span>
            <span className="lp-desc">{p.description}</span>
          </div>

          <span className="lp-price">
            {currency}
            {p.new_price}
          </span>
          <span className="lp-cat">{p.category}</span>

          <div className="lp-actions">
            <button className="lp-btn-edit" onClick={() => openEdit(p)}>
              Editar
            </button>
            <img
              src={cross_icon}
              alt="Remover"
              className="lp-remove"
              onClick={() => confirmRemove(p.id)}
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
              <button className="lp-close" onClick={closeEdit}>
                ✕
              </button>
            </div>

            <div className="lp-modal-grid">
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
                <select
                  value={editing.category}
                  onChange={(e) =>
                    setEditing({ ...editing, category: e.target.value })
                  }
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>


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
