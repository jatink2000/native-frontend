import React, { createContext, useCallback, useEffect, useState } from "react";
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';

export const ProductsDashboardContext = createContext();

export const ProductsDashboardProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PRODUCTS}`);
      const data = await response.json();
      if (data.status) setProducts(data.products || []);
    } catch (e) {
      console.error("Error fetching products:", e);
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  //======================================
  //Add Product
  //======================================
  const addProduct = async (productData) => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PRODUCTS}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    const data = await response.json();
    if (data.status) {
      await fetchProducts();
      return data;
    }
    throw new Error(data.message || "Failed to add product");
  }; 

  //======================================
  //Update Product
  //======================================
  const updateProduct = async (id, productData) => {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS}/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      }
    );
    const data = await response.json();
    if (data.status) {
      // Backend returns { product: updatedProduct }
      const updated = data.product;
      setProducts((prev) =>
        prev.map((p) => (p._id === id || p._id === updated?._id ? updated : p))
      );
      return updated || data.product;
    }
    throw new Error(data.message || "Failed to update product");
  }; 

  //======================================
  //Delete Product
  //======================================
  const deleteProduct = async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS}/${encodeURIComponent(String(id))}`,
        { method: "DELETE" }
      );
      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          `Bad response (${response.status}): ${text.slice(0, 120)}`
        );
      }
      if (data.status) {
        setProducts((prev) =>
          prev.filter((p) => String(p._id) !== String(id))
        );
        return data;
      } else {
        throw new Error(data.message || "Failed to delete from database");
      }
    } catch (e) {
      console.error("Error deleting product:", e);
      throw e;
    }
  };

  return (
    <ProductsDashboardContext.Provider
      value={{
        products,
        loading,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductsDashboardContext.Provider>
  );
};

