// frontend/src/Context/ShopContext.jsx
import React, { createContext, useEffect, useState } from "react";
import { backend_url } from "../App";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([]);

  const getDefaultCart = () => {
    let cart = {};
    for (let i = 0; i < 300; i++) cart[i] = 0;
    return cart;
  };

  const [cartItems, setCartItems] = useState(getDefaultCart());

  useEffect(() => {
    // 🔹 Buscar todos os produtos
    fetch(`${backend_url}/allproducts`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Erro ao buscar produtos:", err));

    // 🔹 Buscar carrinho do usuário logado (se houver token)
    const token = localStorage.getItem("auth-token");
    if (token) {
      fetch(`${backend_url}/getcart`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({}),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data === "object") setCartItems(data);
        })
        .catch((err) => console.error("Erro ao buscar carrinho:", err));
    }
  }, []);

  // 🔹 Soma total do carrinho
  const getTotalCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      if (cartItems[id] > 0) {
        const product = products.find((p) => p.id === Number(id));
        if (product) total += product.new_price * cartItems[id];
      }
    }
    return total;
  };

  // 🔹 Quantidade total de itens no carrinho
  const getTotalCartItems = () => {
    let total = 0;
    for (const id in cartItems) if (cartItems[id] > 0) total += cartItems[id];
    return total;
  };

  // 🔹 Adicionar item
  const addToCart = (itemId) => {
    if (!localStorage.getItem("auth-token")) {
      alert("Please login to add items to your cart.");
      return;
    }

    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));

    fetch(`${backend_url}/addtocart`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
      body: JSON.stringify({ itemId }),
    }).catch((err) => console.error("Erro ao adicionar item:", err));
  };

  // 🔹 Remover item
  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: Math.max(prev[itemId] - 1, 0), // impede ficar negativo
    }));

    const token = localStorage.getItem("auth-token");
    if (token) {
      fetch(`${backend_url}/removefromcart`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ itemId }),
      }).catch((err) => console.error("Erro ao remover item:", err));
    }
  };

  // 🔹 Contexto que será usado pelos componentes
  const contextValue = {
    products,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
