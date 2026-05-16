import React, { createContext, useContext, useCallback, useEffect, useState } from "react";
import { ProductsDashboardContext } from "./ProductsDashboardContext";
import { API_BASE_URL, API_ENDPOINTS } from "../constants/api";

export const CategoriesDashboardContext = createContext();

export const CategoriesDashboardProvider = ({ children }) => {
  const productsCtx = useContext(ProductsDashboardContext);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = API_BASE_URL;

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}${API_ENDPOINTS.CATEGORIES}`);
      const data = await response.json();
      if (data.status) setCategories(data.categories || []);
    } catch (e) {
      console.error("Error fetching categories:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);


  //===================================
  // Add Category function
  //===================================
  const addCategory = async (categoryData) => {
    const response = await fetch(`${API_BASE}${API_ENDPOINTS.CATEGORIES}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoryData),
    });
    const data = await response.json();
    if (data.status) {
      await fetchCategories();
      return data;
    }
    throw new Error(data.message || "Failed to add category");
  };

  
  //===================================
  // Delete Category function
  //===================================
  const deleteCategory = async (id) => {
    try {
      const response = await fetch(
        `${API_BASE}${API_ENDPOINTS.CATEGORIES}/${encodeURIComponent(String(id))}`,
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
        setCategories((prev) =>
          prev.filter((c) => String(c._id) !== String(id))
        );
        try {
          if (productsCtx?.fetchProducts) {
            await productsCtx.fetchProducts();
          }
        } catch (refreshErr) {
          console.warn("Products refresh after category delete:", refreshErr);
        }
        return data;
      } else {
        throw new Error(data.message || "Delete failed");
      }
    } catch (e) {
      console.error("Delete Error:", e);
      throw e;
    }
  };
  
  
  //===================================
  // update Category
  //===================================
  const updateCategory = async (id, categoryData) => {
    const response = await fetch(
      `${API_BASE}${API_ENDPOINTS.CATEGORIES}/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      }
    );
    const data = await response.json();
    if (data.status) {
      const updated = data.category;
      setCategories((prev) => prev.map((c) => (c._id === id ? updated : c)));
      return updated || data.category;
    }
    throw new Error(data.message || "Failed to update category");
  };
  
  return (
    <CategoriesDashboardContext.Provider
      value={{
        categories,
        loading,
        fetchCategories,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoriesDashboardContext.Provider>
  );
};

