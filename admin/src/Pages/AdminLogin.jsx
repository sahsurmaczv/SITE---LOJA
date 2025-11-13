import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/AdminLogin.css";
import { backend_url } from "../App";

const AdminLogin = ({ setToken }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${backend_url}/adminlogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success && data.token) {
        // ✅ Salva token no localStorage e no estado global
        localStorage.setItem("admin_token", data.token);
        setToken(data.token);
        navigate("/admin");
      } else {
        setError(data.message || "Credenciais inválidas.");
      }
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <form onSubmit={handleLogin} className="admin-login-form">
        <h2>Admin Login</h2>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default AdminLogin;
