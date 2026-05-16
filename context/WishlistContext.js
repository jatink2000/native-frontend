//===================================
//     WishlistContext
//===================================
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { API_BASE_URL } from '../constants/api';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { usePathname } from "expo-router";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const pathname = usePathname();
  const [wishlist, setWishlist] = useState([]);
  const API_URL = API_BASE_URL;

  const getUserEmail = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser)?.email : null;
    } catch (_e) {
      return null;
    }
  };

  const fetchWishlist = useCallback(async () => {
    try {
      const userEmail = await getUserEmail();
      if (!userEmail) {
        setWishlist([]);
        return;
      }
      const response = await fetch(
        `${API_URL}/wishlist?userEmail=${encodeURIComponent(userEmail)}`,
      );
      const data = await response.json();
      if (data.status) {
        const normalizedWishlist = (data.wishlist || []).map((item) => ({
          ...item,
          _id: item.productId || item._id,
        }));
        setWishlist(normalizedWishlist);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchWishlist();
  }, [pathname, fetchWishlist]);

  //================================
  // Add to Wishlist
  //================================
  const addToWishlist = async (product) => {
    const productId = product._id || product.productId || product.productCode;
    if (!productId) return;

    try {
      const userEmail = await getUserEmail();
      if (!userEmail) {
        Alert.alert("Login required", "Please login to add items to wishlist.");
        return;
      }
      await fetch(`${API_URL}/wishlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail,
          ...product,
          productId,
          image: product.image || product.thumbnail,
        }),
      });
      fetchWishlist();
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  //================================
  // remove from Wishlist
  //================================
  const removeFromWishlist = async (product) => {
    try {
      const userEmail = await getUserEmail();
      if (!userEmail) {
        Alert.alert("Login required", "Please login to manage your wishlist.");
        return;
      }
      await fetch(
        `${API_URL}/wishlist/${product._id}?userEmail=${encodeURIComponent(userEmail)}`,
        { method: 'DELETE' },
      );
      fetchWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };
  
  //================================
  // update Wishlist
  //================================
  const updateProductInWishlist = (updatedProduct) => {
    const updatedWishlist = wishlist.map((item) =>
      item._id === updatedProduct._id ? { ...item, ...updatedProduct } : item
    );
    setWishlist(updatedWishlist);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, updateProductInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
