import React, { createContext, useContext, useState } from "react";
import "./Toast.css";

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, actions = null) => {
    setToast({ message, actions });

    setTimeout(() => {
      if (!actions) setToast(null);
    }, actions ? 8000 : 2500);
  };

  const closeToast = () => setToast(null);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div className="toast-container">
          <div className="toast-box">
            <p>{toast.message}</p>

            {toast.actions && (
              <div className="toast-actions">
                {toast.actions.map((btn, i) => (
                  <button
                    key={i}
                    className={`toast-btn ${btn.type}`}
                    onClick={() => {
                      btn.onClick();
                      closeToast();
                    }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};
