import React, { createContext, useEffect, useState } from "react";
import { backend_url } from "../App";
import { useToast } from "../Components/Toast/ToastProvider";
export const ShopContext = createContext(null);

const normalizeCart = (raw) => {
  const out = {};
  for (const key in raw) {
    out[String(key)] = Number(raw[key]) || 0;
  }
  return out;
};
const ShopContextProvider = (props) => {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [loadingCart, setLoadingCart] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("auth-token"));
  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem("auth-token");
      if (saved !== token) {
        setToken(saved);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [token]);
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
  useEffect(() => {
    if (!token) {
      setCartItems({});
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
          setCartItems(normalizeCart(data));
        }
      } catch (err) {
        console.error("Erro ao carregar carrinho:", err);
      } finally {
        setLoadingCart(false);
      }
    };
    loadCart();
  }, [token]);
  const addToCart = async (itemId) => {
    if (!token) {
      showToast("Faça login para adicionar ao carrinho");
      return;
    }
    setCartItems((prev) => {
      const updated = { ...prev };
      updated[itemId] = (updated[itemId] || 0) + 1;
      return updated;
    });
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
    setCartItems((prev) => {
      const updated = { ...prev };
      updated[itemId] = Math.max((updated[itemId] || 0) - 1, 0);
      return updated;
    });
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
  const logoutCleanup = () => {
    setCartItems({});
    setToken(null);
  };
  const clearCart = async () => {
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
  const getTotalCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      const quantity = cartItems[id];
      if (quantity > 0) {
        const product = products.find((p) => String(p.id) === String(id));
        if (product) total += product.new_price * quantity;
      }
    }
    return total;
  };
  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((sum, q) => sum + Number(q), 0);
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
    logoutCleanup,
    token,
    setToken,
  };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
