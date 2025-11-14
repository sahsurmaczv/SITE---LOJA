import React, { useContext, useEffect, useState } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import { backend_url, currency } from "../../App";
import cross_icon from "../Assets/logo.png";

const CartItems = () => {
  const { 
    products, 
    cartItems, 
    addToCart, 
    removeFromCart, 
    clearCart, 
    getTotalCartAmount 
  } = useContext(ShopContext);

  const [loaded, setLoaded] = useState(false);

  // Aguarda produtos + carrinho serem carregados
  useEffect(() => {
    if (products.length > 0 && Object.keys(cartItems).length > 0) {
      setLoaded(true);
    }
  }, [products, cartItems]);

  if (!loaded) {
    return (
      <div className="empty-cart">
        <p>Carregando carrinho...</p>
      </div>
    );
  }

  const totalAmount = getTotalCartAmount();
  const hasItems = Object.values(cartItems).some((qtd) => qtd > 0);
  const phoneNumber = "5542998275219";

  const buildWhatsAppMessage = () => {
    let msg = "Olá! Gostaria de solicitar os seguintes produtos:%0A%0A";

    products.forEach((product) => {
      const q = cartItems[product.id];
      if (q > 0) {
        msg += `• ${product.name} (${q}x) - ${currency}${(
          product.new_price * q
        ).toFixed(2)}%0A`;
      }
    });

    msg += `%0A💰 Total da compra: *${currency}${totalAmount.toFixed(2)}*`;
    return msg;
  };

  const sendWhatsAppOrder = () => {
    if (!hasItems) return alert("Seu carrinho está vazio 🛒");

    const url = `https://wa.me/${phoneNumber}?text=${buildWhatsAppMessage()}`;
    window.open(url, "_blank");
  };

  const getImageUrl = (img) =>
    img?.startsWith("http") ? img : `${backend_url}${img}`;

  return (
    <div className="cartitems fade-in">
      <div className="cartitems-format-main">
        <p>Produto</p>
        <p>Descrição</p>
        <p>Preço</p>
        <p>Qtd</p>
        <p>Total</p>
        <p>Remover</p>
      </div>

      <hr />

      {!hasItems ? (
        <div className="empty-cart">
          <p>Seu carrinho está vazio 🛒</p>
        </div>
      ) : (
        products.map((product) => {
          const quantity = cartItems[product.id] || 0;
          if (quantity === 0) return null;

          return (
            <div key={product.id}>
              <div className="cartitems-format-main cartitems-format">

                {/* IMG */}
                <img
                  className="cartitems-product-icon"
                  src={getImageUrl(product.image)}
                  alt={product.name}
                />

                <p className="cartitems-product-title">{product.name}</p>

                <p>{currency}{Number(product.new_price).toFixed(2)}</p>

                <div className="cartitems-quantity-box">
                  <button
                    className="qty-btn"
                    onClick={() => removeFromCart(product.id)}
                  >
                    -
                  </button>

                  <span className="qty-number">{quantity}</span>

                  <button
                    className="qty-btn"
                    onClick={() => addToCart(product.id)}
                  >
                    +
                  </button>
                </div>

                <p>
                  {currency}
                  {(product.new_price * quantity).toFixed(2)}
                </p>

                <img
                  onClick={() => removeFromCart(product.id)}
                  className="cartitems-remove-icon"
                  src={cross_icon}
                  alt="Remover item"
                />
              </div>

              <hr />
            </div>
          );
        })
      )}

      {hasItems && (
        <div className="cartitems-down">
          <div className="cartitems-total card">
            <h1>Resumo do Pedido</h1>

            <div>
              <div className="cartitems-total-item">
                <p>Subtotal</p>
                <p>{currency}{totalAmount.toFixed(2)}</p>
              </div>

              <hr />

              <div className="cartitems-total-item">
                <h3>Total</h3>
                <h3>{currency}{totalAmount.toFixed(2)}</h3>
              </div>
            </div>

            <button onClick={sendWhatsAppOrder} className="whatsapp-button">
              ENVIAR PEDIDO VIA WHATSAPP 📱
            </button>

            <button
              onClick={clearCart}
              className="whatsapp-button"
              style={{ background: "#ff3b30", marginTop: "10px" }}
            >
              LIMPAR CARRINHO 🗑
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItems;
