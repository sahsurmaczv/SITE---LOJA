import React from "react";
import AddProduct from "../components/AddProduct/AddProduct";
import ListProduct from "../components/ListProduct/ListProduct";
import { Routes, Route, Navigate } from "react-router-dom";
import "./CSS/Admin.css";

const Admin = () => {
  return (
    <div className="container-center admin-content">
      <Routes>
        <Route path="/" element={<Navigate to="addproduct" replace />} />
        <Route path="addproduct" element={<AddProduct />} />
        <Route path="listproduct" element={<ListProduct />} />
      </Routes>
    </div>
  );
};

export default Admin;
