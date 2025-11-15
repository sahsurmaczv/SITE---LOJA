import React, { createContext, useEffect, useState } from "react";
import { backend_url } from "../App";
import { useToast } from "../Components/Toast/ToastProvider";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [loadingCart, setLoadingCart] = useState(true);

  // ================================
  // CARREGAR PRODUTOS
  // ================================
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

  // ================================
  // CARREGAR CARRINHO DO USUÁRIO
  // ================================
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
  }, [products]);

  // ============================================================
  // LIMPAR AUTOMATICAMENTE PRODUTOS QUE NÃO EXISTEM MAIS
  // ============================================================
  useEffect(() => {
    if (products.length === 0) return;

    setCartItems((prev) => {
      const newCart = {};

      products.forEach((p) => {
        if (prev[p.id] > 0) {
          newCart[p.id] = prev[p.id];
        }
      });

      return newCart;
    });
  }, [products]);

  // ================================
  // FUNÇÕES DO CARRINHO
  // ================================
  const addToCart = async (itemId) => {
    const token = localStorage.getItem("auth-token");

    if (!token) {
      showToast("Faça login para adicionar ao carrinho");
      return;
    }

    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    showToast("Produto adicionado ao carrinho!");

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

  // ================================
  // TOTAL DO CARRINHO
  // ================================
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
    return products.reduce((sum, p) => sum + (cartItems[p.id] || 0), 0);
  };

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
