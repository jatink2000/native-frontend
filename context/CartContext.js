//===================================
//     CartContext
//===================================
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { API_BASE_URL } from '../constants/api';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { usePathname } from "expo-router";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const pathname = usePathname();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const API_URL = API_BASE_URL;

  const getUserEmail = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser)?.email : null;
    } catch (_e) {
      return null;
    }
  };

  const fetchCart = useCallback(async () => {
    try {
      const userEmail = await getUserEmail();
      if (!userEmail) {
        setCart([]);
        return;
      }
      const response = await fetch(
        `${API_URL}/cart?userEmail=${encodeURIComponent(userEmail)}`,
      );
      const data = await response.json();
      if (data.status) {
        const normalizedCart = (data.cart || []).map((item) => ({
          ...item,
          _id: item.productId || item._id,
          quantity: item.quantity || 1,
        }));
        setCart(normalizedCart);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchCart();
  }, [pathname, fetchCart]);

  useEffect(() => {
    const newTotal = cart.reduce((acc, item) => acc + item.salePrice * item.quantity, 0);
    setTotal(newTotal);
  }, [cart]);

  const addToCart = async (product) => {
    const productId = product._id || product.productId || product.productCode;
    if (!productId) return;

    try {
      const userEmail = await getUserEmail();
      if (!userEmail) {
        Alert.alert("Login required", "Please login to add items to cart.");
        return;
      }
      await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail,
          ...product,
          productId,
          image: product.image || product.thumbnail,
          quantity: 1,
        }),
      });
      fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const increaseQuantity = async (product) => {
    try {
      const cartItem = cart.find((item) => item._id === product._id);
      if (!cartItem) return;

      const userEmail = await getUserEmail();
      if (!userEmail) {
        Alert.alert("Login required", "Please login to manage your cart.");
        return;
      }
      await fetch(`${API_URL}/cart/${cartItem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail,
          quantity: (cartItem.quantity || 1) + 1,
        }),
      });
      fetchCart();
    } catch (error) {
      console.error('Error increasing quantity:', error);
    }
  };

  const decreaseQuantity = async (product) => {
    try {
      const cartItem = cart.find((item) => item._id === product._id);
      if (!cartItem) return;

      const userEmail = await getUserEmail();
      if (!userEmail) {
        Alert.alert("Login required", "Please login to manage your cart.");
        return;
      }
      const nextQty = (cartItem.quantity || 1) - 1;
      if (nextQty <= 0) {
        await fetch(
          `${API_URL}/cart/${cartItem._id}?userEmail=${encodeURIComponent(userEmail)}`,
          { method: 'DELETE' },
        );
      } else {
        await fetch(`${API_URL}/cart/${cartItem._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userEmail, quantity: nextQty }),
        });
      }
      fetchCart();
    } catch (error) {
      console.error('Error decreasing quantity:', error);
    }
  };

  const removeFromCart = async (product) => {
    try {
      const id = product.productId || product._id;
      if (!id) return;
      const userEmail = await getUserEmail();
      if (!userEmail) {
        Alert.alert("Login required", "Please login to manage your cart.");
        return;
      }
      await fetch(
        `${API_URL}/cart/${encodeURIComponent(id)}?userEmail=${encodeURIComponent(userEmail)}`,
        { method: 'DELETE' },
      );
      fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateProductInCart = (updatedProduct) => {
    const updatedCart = cart.map((item) =>
      item._id === updatedProduct._id ? { ...item, ...updatedProduct } : item
    );
    setCart(updatedCart);
  };

  return (
    <CartContext.Provider value={{ cart, total, addToCart, increaseQuantity, decreaseQuantity, removeFromCart, updateProductInCart }}>
      {children}
    </CartContext.Provider>
  );
};
