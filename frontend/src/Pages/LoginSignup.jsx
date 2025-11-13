// frontend/src/Pages/LoginSignup.jsx
import React, { useState } from "react";
import "./CSS/LoginSignup.css";
import { backend_url } from "../App";

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

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
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const dataObj = await resp.json();
      if (dataObj.success) {
        localStorage.setItem("auth-token", dataObj.token);
        window.location.replace("/");
      } else {
        alert(dataObj.message || dataObj.error || "Erro no login");
      }
    } catch (err) {
      console.error("Erro login:", err);
      alert("Erro de conexão ao realizar login");
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
        body: JSON.stringify({ username: formData.username, email: formData.email, password: formData.password }),
      });
      const dataObj = await resp.json();
      if (dataObj.success) {
        localStorage.setItem("auth-token", dataObj.token);
        window.location.replace("/");
      } else {
        alert(dataObj.message || dataObj.error || "Erro no cadastro");
      }
    } catch (err) {
      console.error("Erro signup:", err);
      alert("Erro de conexão ao realizar cadastro");
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" ? <input type="text" placeholder="Your name" name="username" value={formData.username} onChange={changeHandler} /> : null}
          <input type="email" placeholder="Email address" name="email" value={formData.email} onChange={changeHandler} />
          <input type="password" placeholder="Password" name="password" value={formData.password} onChange={changeHandler} />
        </div>

        <button onClick={() => { state === "Login" ? login() : signup() }}>Continue</button>

        {state === "Login" ? (
          <p className="loginsignup-login">Create an account? <span onClick={() => { setState("Sign Up") }}>Click here</span></p>
        ) : (
          <p className="loginsignup-login">Already have an account? <span onClick={() => { setState("Login") }}>Login here</span></p>
        )}

        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
