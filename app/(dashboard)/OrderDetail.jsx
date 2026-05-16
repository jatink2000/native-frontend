//===================================
//     Order Detail Page
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
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { API_BASE_URL } from "../../constants/api";
import { MaterialIcons } from "@expo/vector-icons";

const OrderDetail = () => {
  const router = useRouter();
  const { id: orderId } = useLocalSearchParams();
  const [order, setOrder] = useState(null);
  const [userData, setUserData] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const statusOptions = ["Processing", "Delivered", "Cancelled", "Pending"];

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const updateOrderStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const response = await axios.put(`${API_BASE_URL}/orders/${orderId}`, {
        status: newStatus,
      });
      
      if (response.data.status) {
        setOrder(response.data.order);
        Alert.alert("Success", "Order status updated successfully");
        setShowStatusModal(false);
      } else {
        Alert.alert("Error", response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      Alert.alert("Error", "Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
      
      if (!response.data.status || !response.data.order) {
        return Alert.alert("Error", "Order not found");
      }
      
      const orderData = response.data.order;
      setOrder(orderData);

      // Shipping address extraction directly from order object
      if (orderData.shippingAddress) {
        setShippingAddress(orderData.shippingAddress);
      }

      // Fetch User details for extra info (optional)
      try {
        if (orderData.userEmail) {
          const userRes = await axios.get(
            `${API_BASE_URL}/get-user/${orderData.userEmail}`,
          );
          if (userRes.data.status) setUserData(userRes.data.user);
        }
      } catch (userError) {
        console.log("User fetch skipped, using order data only");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      Alert.alert("Error", "Failed to load order details");
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
    });
  };

  const downloadInvoice = () => {
    Alert.alert("Invoice", "Invoice download feature coming soon!");
  };

  if (loading)
    return (
      <ActivityIndicator size="large" color="#0aad0a" style={{ flex: 1 }} />
    );

  if (!order) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#34495e" />
        </TouchableOpacity>
        <Text style={styles.errorText}>Order not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#34495e" />
        </TouchableOpacity>
        <Text style={styles.title}>Order Details</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* User ID and Download Invoice */}
      <View style={styles.section}>
        <View style={styles.userIdHeader}>
          <Text style={styles.sectionTitle}>Order #{order._id}</Text>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={downloadInvoice}
          >
            <MaterialIcons name="download" size={18} color="#fff" />
            <Text style={styles.downloadButtonText}>Download Invoice</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* User Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Details</Text>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name:</Text>
            <Text style={styles.detailValue}>{order.customerName || userData?.name || "N/A"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email:</Text>
            <Text style={styles.detailValue}>{order.userEmail || userData?.email || "N/A"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone:</Text>
            <Text style={styles.detailValue}>{userData?.phone || "N/A"}</Text>
          </View>
        </View>
      </View>

      {/* Shipping Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <View style={styles.detailsCard}>
          {shippingAddress ? (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Address:</Text>
                <Text style={styles.detailValue}>
                  {shippingAddress.address || "N/A"}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>City:</Text>
                <Text style={styles.detailValue}>
                  {shippingAddress.city || "N/A"}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>State:</Text>
                <Text style={styles.detailValue}>
                  {shippingAddress.state || "N/A"}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Postal Code:</Text>
                <Text style={styles.detailValue}>
                  {shippingAddress.zipCode || "N/A"}
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.noData}>No address saved</Text>
          )}
        </View>
      </View>

      {/* Order Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Details</Text>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order ID:</Text>
            <Text style={styles.detailValue} numberOfLines={1}>
              {order._id || "N/A"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order Date:</Text>
            <Text style={styles.detailValue}>
              {formatDate(order.createdAt || order.date)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order Status:</Text>
            <Text
              style={[
                styles.detailValue,
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
          </View>
          <View
            style={[
              styles.detailRow,
              {
                borderTopWidth: 1,
                borderTopColor: "#ddd",
                paddingTop: 10,
                marginTop: 10,
              },
            ]}
          >
            <Text style={[styles.detailLabel, { fontWeight: "bold" }]}>
              Total Amount:
            </Text>
            <Text
              style={[
                styles.detailValue,
                { fontWeight: "bold", color: "#27ae60", fontSize: 16 },
              ]}
            >
              ₹{order.totalAmount || "0"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.updateStatusButton}
            onPress={() => setShowStatusModal(true)}
            disabled={updating}
          >
            <MaterialIcons name="edit" size={16} color="#fff" />
            <Text style={styles.updateStatusButtonText}>
              {updating ? "Updating..." : "Update Status"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Products List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Products Ordered</Text>
        {order.items && order.items.length > 0 ? (
          order.items.map((item, index) => (
            <View key={index} style={styles.productCard}>
              <View style={styles.productImageContainer}>
                {item.image ? (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.productCardImage}
                  />
                ) : (
                  <View style={styles.noImagePlaceholder}>
                    <Text style={styles.noImageText}>No Image</Text>
                  </View>
                )}
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>
                  {item.productName || item.title || "Product"}
                </Text>
                <View style={styles.productDetailRow}>
                  <Text style={styles.productLabel}>Price:</Text>
                  <Text style={styles.productValue}>
                    ₹{item.productPrice || item.salePrice || "0"}
                  </Text>
                </View>
                <View style={styles.productDetailRow}>
                  <Text style={styles.productLabel}>Quantity:</Text>
                  <Text style={styles.productValue}>
                    {item.productCount || item.quantity || "1"}
                  </Text>
                </View>
                <View style={styles.productDetailRow}>
                  <Text style={styles.productLabel}>Subtotal:</Text>
                  <Text style={[styles.productValue, { fontWeight: "bold", color: "#27ae60" }]}>
                    ₹{((item.productPrice || item.salePrice || 0) * (item.productCount || item.quantity || 1))}
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noData}>No items in this order</Text>
        )}
      </View>

      {/* Status Update Modal */}
      <Modal
        visible={showStatusModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Order Status</Text>
              <TouchableOpacity onPress={() => setShowStatusModal(false)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.statusOptionsContainer}>
              {statusOptions.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusOption,
                    order.status === status && styles.statusOptionActive,
                  ]}
                  onPress={() => updateOrderStatus(status)}
                  disabled={updating}
                >
                  <View
                    style={[
                      styles.statusOptionCircle,
                      order.status === status && styles.statusOptionCircleActive,
                      {
                        borderColor:
                          status === "Delivered"
                            ? "#0aad0a"
                            : status === "Cancelled"
                              ? "#dc3545"
                              : "#f39c12",
                      },
                    ]}
                  >
                    {order.status === status && (
                      <MaterialIcons name="check" size={16} color="#fff" />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.statusOptionText,
                      order.status === status && styles.statusOptionTextActive,
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowStatusModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#34495e",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#34495e",
    marginBottom: 12,
  },
  userIdHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  downloadButton: {
    flexDirection: "row",
    backgroundColor: "#27ae60",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  downloadButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  detailRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
  },
  detailLabel: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  detailValue: {
    flex: 1.5,
    fontSize: 14,
    color: "#333",
  },
  profileButton: {
    flexDirection: "row",
    marginTop: 12,
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  profileButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  productsTable: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  productsHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  productsHeaderCell: {
    fontWeight: "700",
    color: "#34495e",
    fontSize: 12,
  },
  productsRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  productsCell: {
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
  noData: {
    padding: 20,
    textAlign: "center",
    color: "#999",
    fontSize: 14,
  },
  errorText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "flex-start",
  },
  productImageContainer: {
    marginRight: 12,
  },
  productCardImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    resizeMode: "cover",
  },
  noImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  productDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  productLabel: {
    fontSize: 12,
    color: "#666",
  },
  productValue: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  updateStatusButton: {
    flexDirection: "row",
    marginTop: 15,
    backgroundColor: "#0984e3",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  updateStatusButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statusOptionsContainer: {
    marginBottom: 20,
  },
  statusOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  statusOptionActive: {
    backgroundColor: "#f0f9ff",
    borderColor: "#0984e3",
  },
  statusOptionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  statusOptionCircleActive: {
    backgroundColor: "#0984e3",
    borderColor: "#0984e3",
  },
  statusOptionText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  statusOptionTextActive: {
    color: "#0984e3",
    fontWeight: "600",
  },
  modalCloseButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignItems: "center",
  },
  modalCloseButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});

export default OrderDetail;
