import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/AdminLogin.css";
import { backend_url } from "../App";

const AdminLogin = ({ setToken }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${backend_url}/adminlogin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem("admin_token", data.token);
        setToken(data.token);
        navigate("/admin");
      } else {
        setError(data.message || "Credenciais inválidas.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <form onSubmit={handleLogin} className="admin-login-form">
        <h2>Painel Admin</h2>
        <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default AdminLogin;
