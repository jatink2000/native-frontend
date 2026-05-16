//===================================
//     All Orders (Admin View) - List
//===================================
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { API_BASE_URL } from "../../constants/api";

const AllOrders = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`);
      if (response.data.status) {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      Alert.alert("Error", "Orders fetch nahi ho paye.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading)
    return (
      <ActivityIndicator size="large" color="#0aad0a" style={{ flex: 1 }} />
    );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>All Orders - List View</Text>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, { flex: 0.6 }]}>Image</Text>
          <Text style={[styles.headerCell, { flex: 1.2 }]}>Order ID</Text>
          <Text style={[styles.headerCell, { flex: 1.2 }]}>Customer</Text>
          <Text style={[styles.headerCell, { flex: 1 }]}>Date</Text>
          <Text style={[styles.headerCell, { flex: 0.8 }]}>Status</Text>
          <Text style={[styles.headerCell, { flex: 0.8 }]}>Amount</Text>
        </View>

        {orders.length > 0 ? (
          orders.map((order) => {
            const firstItem = order.items && order.items[0];
            return (
              <TouchableOpacity
                key={order._id}
                style={styles.row}
                onPress={() => router.push({
                  pathname: "/OrderDetail",
                  params: { id: order._id }
                })}
              >
                <View style={[styles.imageCell, { flex: 0.6 }]}>
                  {firstItem?.image ? (
                    <Image
                      source={{ uri: firstItem.image }}
                      style={styles.productImage}
                    />
                  ) : (
                    <View style={styles.noImage}>
                      <Text style={styles.noImageText}>-</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.cell, { flex: 1.2 }]} numberOfLines={2}>
                  {order._id?.slice(-8) || "N/A"}
                </Text>
                <Text style={[styles.cell, { flex: 1.2 }]} numberOfLines={2}>
                  {order.customerName || order.userEmail || "N/A"}
                </Text>
                <Text style={[styles.cell, { flex: 1 }]} numberOfLines={1}>
                  {formatDate(order.createdAt || order.date)}
                </Text>
                <Text
                  style={[
                    styles.cell,
                    { flex: 0.8 },
                    {
                      color:
                        order.status === "Delivered"
                          ? "#0aad0a"
                          : order.status === "Cancelled"
                            ? "#dc3545"
                            : "#f39c12",
                    },
                  ]}
                >
                  {order.status || "Processing"}
                </Text>
                <Text
                  style={[
                    styles.cell,
                    { flex: 0.8 },
                    { fontWeight: "bold", color: "#27ae60" },
                  ]}
                >
                  ₹{order.totalAmount || "0"}
                </Text>
              </TouchableOpacity>
            );
          })
        ) : (
          <Text style={styles.noData}>No orders found in the system.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#34495e",
  },
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  headerCell: {
    fontWeight: "bold",
    color: "#34495e",
    fontSize: 12,
  },
  row: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  cell: {
    fontSize: 12,
    color: "#333",
  },
  imageCell: {
    alignItems: "center",
    justifyContent: "center",
  },
  productImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
    resizeMode: "cover",
  },
  noImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  noImageText: {
    color: "#999",
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
  },
  viewButton: {
    backgroundColor: "#007bff",
    padding: 6,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 11,
  },
  noData: {
    padding: 20,
    textAlign: "center",
    color: "#999",
    fontSize: 14,
  },
});

export default AllOrders;
