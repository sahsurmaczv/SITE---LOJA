import React, { createContext, useEffect, useState } from "react";
import { backend_url } from "../App";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [loadingCart, setLoadingCart] = useState(true);

  // -----------------------------
  // 1) Carrega produtos
  // -----------------------------
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(`${backend_url}/allproducts`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
      }
    };

    loadProducts();
  }, []);

  // -----------------------------
  // 2) Carrega carrinho APÓS produtos
  // -----------------------------
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      setLoadingCart(false);
      return;
    }

    const loadCart = async () => {
      try {
        const res = await fetch(`${backend_url}/getcart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        });

        const data = await res.json();
        if (data && typeof data === "object") {
          setCartItems(data);
        }
      } catch (err) {
        console.error("Erro ao carregar carrinho:", err);
      } finally {
        setLoadingCart(false);
      }
    };

    loadCart();
  }, [products]); // ← garante ordem correta!

  // -----------------------------
  // Funções do carrinho
  // -----------------------------
  const addToCart = async (itemId) => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      alert("Faça login para adicionar itens ao carrinho.");
      return;
    }

    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    await fetch(`${backend_url}/addtocart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify({ itemId }),
    });
  };

  const removeFromCart = async (itemId) => {
    const token = localStorage.getItem("auth-token");

    setCartItems((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
    }));

    if (token) {
      await fetch(`${backend_url}/removefromcart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ itemId }),
      });
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem("auth-token");
    if (!token) return;

    setCartItems({});

    await fetch(`${backend_url}/clearcart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
    });
  };

  // -----------------------------
  // Totais
  // -----------------------------
  const getTotalCartAmount = () => {
    let total = 0;

    for (const id in cartItems) {
      const quantity = cartItems[id];
      if (quantity > 0) {
        const product = products.find((p) => p.id === Number(id));
        if (product) total += product.new_price * quantity;
      }
    }

    return total;
  };

  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((a, b) => a + b, 0);
  };

  // -----------------------------
  // Contexto final
  // -----------------------------
  const contextValue = {
    products,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalCartAmount,
    getTotalCartItems,
    loadingCart,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
