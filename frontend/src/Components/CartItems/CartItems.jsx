import React, { useContext } from "react";
import "./CartItems.css";
import cross_icon from "../Assets/cart_cross_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { backend_url, currency } from "../../App";

const CartItems = () => {
  const { products, cartItems, removeFromCart, getTotalCartAmount } = useContext(ShopContext);

  const totalAmount = getTotalCartAmount();
  const hasItems = Object.values(cartItems).some((qtd) => qtd > 0);

  // 🔹 Número da empresa no formato internacional (55 = Brasil)
  const phoneNumber = "5542999999999"; // <-- coloque aqui o WhatsApp da empresa

  // 🔹 Monta a mensagem com os produtos do carrinho
  const buildWhatsAppMessage = () => {
    let message = "Olá! Gostaria de solicitar os seguintes produtos:%0A%0A";
    products.forEach((product) => {
      const quantity = cartItems[product.id];
      if (quantity > 0) {
        const itemTotal = (product.new_price * quantity).toFixed(2);
        message += `• ${product.name} (${quantity}x) - ${currency}${itemTotal}%0A`;
      }
    });
    message += `%0A💰 *Total:* ${currency}${totalAmount.toFixed(2)}`;
    return message;
  };

  // 🔹 Abre o WhatsApp com a mensagem pronta
  const sendWhatsAppOrder = () => {
    if (!hasItems) {
      alert("Seu carrinho está vazio 🛒");
      return;
    }
    const message = buildWhatsAppMessage();
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, "_blank");
  };

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Product</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />

      {!hasItems ? (
        <div style={{ textAlign: "center", padding: "50px 0", color: "#777" }}>
          <p>Your cart is empty 🛒</p>
        </div>
      ) : (
        products.map((product) => {
          const quantity = cartItems[product.id] || 0;
          if (quantity === 0) return null;

          return (
            <div key={product.id}>
              <div className="cartitems-format-main cartitems-format">
                <img
                  className="cartitems-product-icon"
                  src={`${backend_url}${product.image}`}
                  alt={product.name}
                />
                <p className="cartitems-product-title">{product.name}</p>
                <p>
                  {currency}
                  {product.new_price}
                </p>
                <button className="cartitems-quantity">{quantity}</button>
                <p>
                  {currency}
                  {(product.new_price * quantity).toFixed(2)}
                </p>
                <img
                  onClick={() => removeFromCart(product.id)}
                  className="cartitems-remove-icon"
                  src={cross_icon}
                  alt="Remove item"
                  title="Remove item"
                />
              </div>
              <hr />
            </div>
          );
        })
      )}

      {/* 🔹 Totais e botão WhatsApp */}
      {hasItems && (
        <div className="cartitems-down">
          <div className="cartitems-total">
            <h1>Cart Totals</h1>
            <div>
              <div className="cartitems-total-item">
                <p>Subtotal</p>
                <p>
                  {currency}
                  {totalAmount.toFixed(2)}
                </p>
              </div>
              <hr />
              <div className="cartitems-total-item">
                <p>Shipping Fee</p>
                <p>Free</p>
              </div>
              <hr />
              <div className="cartitems-total-item">
                <h3>Total</h3>
                <h3>
                  {currency}
                  {totalAmount.toFixed(2)}
                </h3>
              </div>
            </div>

            {/* 💬 Botão de envio via WhatsApp */}
            <button onClick={sendWhatsAppOrder} className="whatsapp-button">
              ENVIAR PEDIDO VIA WHATSAPP 📱
            </button>
          </div>

          <div className="cartitems-promocode">
            <p>If you have a promo code, enter it here:</p>
            <div className="cartitems-promobox">
              <input type="text" placeholder="Promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItems;
