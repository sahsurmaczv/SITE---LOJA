import React from "react";
import AddProduct from "../../Components/AddProduct/AddProduct";
import ListProduct from "../../Components/ListProduct/ListProduct";
import { Routes, Route, Navigate } from "react-router-dom";
import "./Admin.css";

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
