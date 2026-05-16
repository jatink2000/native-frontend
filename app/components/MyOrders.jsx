import React, { useEffect, useState } from "react";
import axios from "axios";
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { API_BASE_URL } from "../../constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const email = storedUser ? JSON.parse(storedUser)?.email : null;

      if (email) {
        // Correct endpoint call
        const response = await axios.get(`${API_BASE_URL}/get-user-orders/${email}`); 
        if (response.data.status) {
          setOrders(response.data.orders || []);
        }
      }
    } catch (error) {
      console.log("Orders fetch error:", error?.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()}>
                  <Feather name="arrow-left" size={24} color="#2c3e50" />
                </TouchableOpacity>
        <Text style={styles.title}>My Orders</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0aad0a" style={{ marginTop: 50 }} />
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <View key={order._id} style={styles.orderCard}>
              {/* Order Header */}
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderIdText}>Order ID: #{order._id.slice(-8).toUpperCase()}</Text>
                  <Text style={styles.dateText}>{formatDate(order.createdAt || order.date)}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: order.status === 'Delivered' ? '#e8f5e9' : '#fff3e0' }]}>
                  <Text style={[styles.statusText, { color: order.status === 'Delivered' ? '#2e7d32' : '#ef6c00' }]}>
                    {order.status || 'Processing'}
                  </Text>
                </View>
              </View>

              {/* Individual Products List */}
              <View style={styles.productsSection}>
                {order.items && order.items.map((item, index) => (
                  <View key={index} style={styles.productRow}>
                    <View style={styles.productInfo}>
                      <Text style={styles.productNameText} numberOfLines={1}>
                        {item.productName || item.title || "Product"}
                      </Text>
                      <Text style={styles.productQtyText}>Qty: {item.productCount || item.quantity || 1}</Text>
                    </View>
                    <Text style={styles.productPriceText}>₹{item.productPrice || item.salePrice || 0}</Text>
                  </View>
                ))}
              </View>

              {/* Order Footer */}
              <View style={styles.orderFooter}>
                <Text style={styles.totalLabel}>Total Amount:</Text>
                <Text style={styles.totalValue}>₹{order.totalAmount}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.noData}>
            <Text style={styles.noDataText}>No orders found.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 45,flex: 1, backgroundColor: "#f5f6f8" },
  content: { padding: 15 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#2c3e50" },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 10,
  },
  orderIdText: { fontSize: 14, fontWeight: "bold", color: "#34495e" },
  dateText: { fontSize: 12, color: "#7f8c8d", marginTop: 2 },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: "bold" },
  productsSection: { paddingVertical: 10 },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  productInfo: { flex: 1 },
  productNameText: { fontSize: 14, color: "#2c3e50", fontWeight: "500" },
  productQtyText: { fontSize: 12, color: "#95a5a6" },
  productPriceText: { fontSize: 14, fontWeight: "600", color: "#2c3e50" },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 10,
    marginTop: 5,
  },
  totalLabel: { fontSize: 14, fontWeight: "bold", color: "#7f8c8d" },
  totalValue: { fontSize: 16, fontWeight: "bold", color: "#0aad0a" },
  noData: { alignItems: 'center', marginTop: 50 },
  noDataText: { color: '#95a5a6', fontSize: 16 },
});

export default MyOrders;