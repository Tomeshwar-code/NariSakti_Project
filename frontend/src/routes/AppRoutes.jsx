import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import HomePage from "../pages/Home/HomePage";
import Login from "../pages/Auth/Login";
import ProductsPage from "../pages/Products/ProductsPage";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import Profile from "../pages/Profile/Profile";
import EditProfile from "../pages/Profile/EditProfile";
import ChangePassword from "../pages/Profile/ChangePassword";
import Logout from "../pages/Auth/Logout";
import ProtectedRoutes from "../routes/ProtectedRoutes";

// seller section
import AddProduct from "../pages/Seller/AddProduct";
import ProductDetails from "../pages/Products/ProductDetails";
import ProductList from "../pages/Products/ProductList";
import MyProduct from "../pages/Seller/MyProduct";
import EditProduct from "../pages/Seller/EditProduct";
import SellerDashboard from "../pages/Seller/Dashboard";
import SellerOrders from "../pages/Seller/Orders";
import CartPage from "../pages/Cart/CartPage";
import CheckoutPage from "../pages/Checkout/CheckoutPage";
import OrdersPage from "../pages/Orders/OrdersPage";
import AdminRoute from "../routes/AdminRoute";
import SellerRoute from "../routes/SellerRoute";
import AdminLayout from "../layouts/AdminLayout";
import MainLayout from "../layouts/MainLayout";
import SellerLayout from "../layouts/SellerLayout";
import AdminDashboard from "../pages/Admin/Dashboard";
import AdminUsers from "../pages/Admin/Users";
import AdminProducts from "../pages/Admin/Products";
import AdminOrders from "../pages/Admin/Orders";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/category/:categorySlug" element={<ProductsPage />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoutes><Outlet /></ProtectedRoutes>}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/profile/change-password" element={<ChangePassword />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Route>
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/productlist" element={<ProductList />} />
        <Route path="/seller" element={<SellerRoute><SellerLayout /></SellerRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="dashboard" element={<SellerDashboard />} />
          <Route path="products" element={<MyProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="orders" element={<SellerOrders />} />
        </Route>
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
