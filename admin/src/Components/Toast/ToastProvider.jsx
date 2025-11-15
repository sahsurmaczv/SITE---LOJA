import React, { createContext, useContext, useState } from "react";
import "./Toast.css";

const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "default", actions = []) => {
    setToast({ message, type, actions });

    if (actions.length === 0) {
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <p className="toast-message">{toast.message}</p>

          {toast.actions.length > 0 && (
            <div className="toast-actions">
              {toast.actions.map((a, i) => (
                <button
                  key={i}
                  className={`toast-btn ${a.type}`}
                  onClick={() => {
                    if (a.onClick) a.onClick();
                    setToast(null);
                  }}
                >
                  {a.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </ToastContext.Provider>
  );
};
