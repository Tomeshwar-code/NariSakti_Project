import { useState } from "react";
import { createProduct } from "../../services/productServices";

function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createProduct(formData);

    alert("Product Added");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        onChange={handleChange}
      />

      <input
        type="text"
        name="description"
        placeholder="Description"
        onChange={handleChange}
      />

      <input
        type="number"
        name="price"
        placeholder="Price"
        onChange={handleChange}
      />

      <input
        type="number"
        name="stock"
        placeholder="Stock"
        onChange={handleChange}
      />

      <input
        type="text"
        name="category"
        placeholder="Category"
        onChange={handleChange}
      />

      <button type="submit">
        Add Product
      </button>
    </form>
  );
}

export default AddProduct;