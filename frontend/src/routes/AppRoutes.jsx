import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/Home/HomePage";
import Login from "../pages/Auth/Login";
import ProductsPage from "../pages/Products/ProductsPage";
import Register from "../pages/Auth/Register";
import Profile from "../pages/Profile/Profile";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/register" element={<Register />} /> 
      <Route path="/profile" element ={<Profile />} />
    </Routes>
  );
}

export default AppRoutes;