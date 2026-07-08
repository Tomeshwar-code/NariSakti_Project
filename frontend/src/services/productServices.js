import axios from "../api/axios";

export const getProducts = () => {
  return axios.get("/products");
};

export const getProduct = (id) => {
  return axios.get(`/products/${id}`);
};

export const createProduct = (data) => {
  return axios.post("/products", data);
};

export const updateProduct = (id, data) => {
  return axios.put(`/products/${id}`, data);
};

export const deleteProduct = (id) => {
  return axios.delete(`/products/${id}`);
};