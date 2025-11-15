import React, { useContext, useEffect, useState } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import { backend_url, currency } from "../../App";
import clear_icon from "../Assets/clear.svg";
import { useToast } from "../Toast/ToastProvider";

const CartItems = () => {
  const { showToast } = useToast();
  const {
    products,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalCartAmount,
  } = useContext(ShopContext);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (products.length > 0 && Object.keys(cartItems).length > 0) {
      setLoaded(true);
    }
  }, [products, cartItems]);
  if (!loaded) {
    return (
      <div className="empty-cart">
        <p>Faça login para adicionar um produto ao carrinho</p>
      </div>
    );
  }
  const totalAmount = getTotalCartAmount();
  const hasItems = Object.values(cartItems).some((qtd) => qtd > 0);
  const phoneNumber = "5542991234394";
  const buildWhatsAppMessage = () => {
    let msg = "*Pedido via Site Neri Informática* %0A";
    msg += "%0A*Produtos escolhidos:*%0A";
    products.forEach((product) => {
      const q = cartItems[product.id];
      if (q > 0) {
        msg += `• ${product.name} — ${q}x — R$ ${(product.new_price * q).toFixed(
          2
        )}%0A`;
      }
    });
    msg += "%0A----------------------------%0A";
    msg += `*Total:* R$ ${totalAmount.toFixed(2)}%0A`;
    msg += "----------------------------%0A";
    msg += "%0A*Aguardando sua confirmação!*";
    return msg;
  };
  const sendWhatsAppOrder = () => {
    if (!hasItems) return alert("Seu carrinho está vazio ");
    const url = `https://wa.me/${phoneNumber}?text=${buildWhatsAppMessage()}`;
    window.open(url, "_blank");
  };
  const getImageUrl = (img) =>
    img?.startsWith("http") ? img : `${backend_url}${img}`;
  return (
    <div className="cartitems fade-in">
      <button className="cart-back-btn" onClick={() => window.history.back()}>
        Voltar
      </button>
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
          <p>Seu carrinho está vazio</p>
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
                  src={getImageUrl(product.image)}
                  alt={product.name}
                />
                <p className="cartitems-product-title">{product.name}</p>

                <p>
                  {currency}
                  {Number(product.new_price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
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
                  {(product.new_price * quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
                <img
                  onClick={() =>
                    showToast(
                      "Remover este item do carrinho?",
                      "warning",
                      [
                        {
                          label: "Cancelar",
                          type: "cancel",
                          onClick: () => { },
                        },
                        {
                          label: "Remover",
                          type: "confirm",
                          onClick: () => removeFromCart(product.id),
                        },
                      ]
                    )
                  }
                  className="cartitems-remove-icon"
                  src={clear_icon}
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
                <p>
                  {currency}
                  {totalAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <hr />
              <div className="cartitems-total-item">
                <h3>Total</h3>
                <h3>
                  {currency}
                  {totalAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
            <button onClick={sendWhatsAppOrder} className="whatsapp-button">
              ENVIAR PEDIDO VIA WHATSAPP
            </button>
            <button
              onClick={() =>
                showToast(
                  "Deseja realmente limpar o carrinho?",
                  "warning",
                  [
                    {
                      label: "Cancelar",
                      type: "cancel",
                      onClick: () => { },
                    },
                    {
                      label: "Limpar",
                      type: "confirm",
                      onClick: () => clearCart(),
                    },
                  ]
                )
              }
              className="whatsapp-button"
              style={{ background: "#ff3b30", marginTop: "10px" }}
            >
              LIMPAR CARRINHO
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItems;
