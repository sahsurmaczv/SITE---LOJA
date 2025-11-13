import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from "../Assets/cross_icon.png";
import upload_area from "../Assets/upload_area.svg";
import { backend_url, currency } from "../../App";



const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // 🧠 Função para resolver corretamente o caminho da imagem
  const getImageUrl = (imgPath) => {
    if (!imgPath) return upload_area; // imagem padrão
    if (imgPath.startsWith("http")) return imgPath;
    return `${backend_url}${imgPath.startsWith("/") ? imgPath : `/${imgPath}`}`;
  };

  // 🔹 Buscar todos os produtos
  const fetchInfo = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backend_url}/allproducts`);
      const data = await res.json();
      setAllProducts(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  // 🔹 Remover produto
  const removeProduct = async (id) => {
    if (!window.confirm("Tem certeza que deseja remover este produto?")) return;
    try {
      await fetch(`${backend_url}/removeproduct`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("admin_token"),

        },
        body: JSON.stringify({ id }),
      });
      alert("✅ Produto removido com sucesso!");
      fetchInfo();
    } catch (error) {
      alert("❌ Erro ao remover produto!");
      console.error(error);
    }
  };

  // 🔹 Abrir modal de edição
  const openEditModal = (product) => {
    setEditingProduct({ ...product });
    setPreviewImage(getImageUrl(product.image)); // usa o resolvedor de imagem
  };

  // 🔹 Salvar alterações (PUT /editproduct)
  const saveChanges = async () => {
    try {
      let imageUrl = editingProduct.image;

      // Se o admin escolheu nova imagem, faz upload
      if (editingProduct.newImageFile) {
        const formData = new FormData();
        formData.append("product", editingProduct.newImageFile);

        const uploadRes = await fetch(`${backend_url}/upload`, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          imageUrl = uploadData.image_url;
        }
      }

      // Atualiza o produto
      const res = await fetch(`${backend_url}/editproduct`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("admin_token"),

        },
        body: JSON.stringify({
          id: editingProduct.id,
          name: editingProduct.name,
          description: editingProduct.description,
          image: imageUrl,
          category: editingProduct.category,
          new_price: editingProduct.new_price,
          old_price: editingProduct.old_price,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Produto atualizado com sucesso!");
        setEditingProduct(null);
        fetchInfo();
      } else {
        alert("❌ Falha ao atualizar produto!");
      }
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      alert("❌ Erro ao atualizar produto!");
    }
  };

  return (
    <div className="listproduct">
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Actions</p>
      </div>

      <div className="listproduct-allproducts">
        <hr />
        {loading ? (
          <p>Carregando produtos...</p>
        ) : allProducts.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "50px", color: "#555" }}>
            <img
              src={upload_area}
              alt="Sem produtos"
              style={{ width: "150px", marginBottom: "20px", opacity: 0.8 }}
            />
            <p>Nenhum produto cadastrado ainda.</p>
          </div>
        ) : (
          allProducts.map((e, index) => (
            <div key={index}>
              <div className="listproduct-format-main listproduct-format">
                <img
                  className="listproduct-product-icon"
                  src={getImageUrl(e.image)}
                  alt={e.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "contain",
                    borderRadius: "6px",
                  }}
                />
                <p>{e.name}</p>
                <p>{currency}{e.old_price}</p>
                <p>{currency}{e.new_price}</p>
                <p>{e.category}</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => openEditModal(e)}
                    style={{
                      background: "#6079ff",
                      border: "none",
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    ✏️ Editar
                  </button>
                  <img
                    className="listproduct-remove-icon"
                    onClick={() => removeProduct(e.id)}
                    src={cross_icon}
                    alt="Remover"
                  />
                </div>
              </div>
              <hr />
            </div>
          ))
        )}
      </div>

      {/* 🔹 Modal de Edição */}
      {editingProduct && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "1000",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "10px",
              width: "400px",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <h2>Editar Produto</h2>
            <input
              type="text"
              placeholder="Nome"
              value={editingProduct.name}
              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
            />
            <textarea
              placeholder="Descrição"
              value={editingProduct.description}
              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
              style={{ resize: "none", height: "60px" }}
            />
            <select
              value={editingProduct.category}
              onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
            >
              <option value="women">Women</option>
              <option value="men">Men</option>
              <option value="kid">Kid</option>
            </select>
            <input
              type="number"
              placeholder="Preço antigo"
              value={editingProduct.old_price}
              onChange={(e) => setEditingProduct({ ...editingProduct, old_price: e.target.value })}
            />
            <input
              type="number"
              placeholder="Novo preço"
              value={editingProduct.new_price}
              onChange={(e) => setEditingProduct({ ...editingProduct, new_price: e.target.value })}
            />
            <label>
              <p>Alterar imagem:</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setEditingProduct({
                      ...editingProduct,
                      newImageFile: file,
                    });
                    setPreviewImage(URL.createObjectURL(file));
                  }
                }}
              />
            </label>
            <img
              src={previewImage || upload_area}
              alt="Preview"
              style={{
                width: "100%",
                height: "150px",
                objectFit: "contain",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
              <button
                onClick={saveChanges}
                style={{
                  background: "#4caf50",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                💾 Salvar
              </button>
              <button
                onClick={() => setEditingProduct(null)}
                style={{
                  background: "#f44336",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListProduct;
