import React, { useState } from "react";
import "./LoginSignup.css";
import { backend_url } from "../../App";
import { useToast } from "../../Components/Toast/ToastProvider";

const LoginSignup = () => {
  const { showToast } = useToast();
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const login = async () => {
    try {
      const resp = await fetch(`${backend_url}/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const dataObj = await resp.json();
      if (dataObj.success) {
        localStorage.setItem("auth-token", dataObj.token);
        showToast("Login realizado com sucesso!", "success");

        setTimeout(() => (window.location.href = "/"), 900);
      } else {
        showToast(dataObj.message || "Erro no login", "error");
      }
    } catch (err) {
      console.error("Erro login:", err);
      showToast("Erro ao conectar ao servidor", "error");
    }
  };
  const signup = async () => {
    try {
      const resp = await fetch(`${backend_url}/signup`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });
      const dataObj = await resp.json();
      if (dataObj.success) {
        showToast("Conta criada com sucesso!", "success");
        localStorage.setItem("auth-token", dataObj.token);

        setTimeout(() => (window.location.href = "/"), 900);
      } else {
        showToast(dataObj.message || "Erro no cadastro", "error");
      }
    } catch (err) {
      console.error("Erro signup:", err);
      showToast("Erro ao conectar ao servidor", "error");
    }
  };
  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" && (
            <input
              type="text"
              placeholder="Seu nome"
              name="username"
              value={formData.username}
              onChange={changeHandler}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={changeHandler}
          />
          <input
            type="password"
            placeholder="Senha"
            name="password"
            value={formData.password}
            onChange={changeHandler}
          />
        </div>
        <button onClick={() => (state === "Login" ? login() : signup())}>
          Continuar
        </button>
        {state === "Login" ? (
          <p className="loginsignup-login">
            Criar uma conta?{" "}
            <span onClick={() => setState("Sign Up")}>Clique aqui</span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Já tem uma conta?{" "}
            <span onClick={() => setState("Login")}>Faça login aqui</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
