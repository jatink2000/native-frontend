import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import RazorpayCheckout from "react-native-razorpay";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { API_BASE_URL } from "../../constants/api";

const PAYMENT_OPTIONS = [
  {
    id: "card",
    title: "Online Payment",
    subtitle: "UPI, Cards, NetBanking",
    icon: "payment",
  },
  {
    id: "cod",
    title: "Cash on Delivery",
    subtitle: "Pay when your order arrives",
    icon: "moped",
  },
];

const Payment = () => {
  const router = useRouter();
  const { checkoutData } = useLocalSearchParams();

  // Data Extraction logic
  const parsedData = checkoutData ? JSON.parse(checkoutData) : null;
  const selectedAddress = parsedData?.selectedAddress || null;
  const products = parsedData?.checkoutProducts || []; // Checkout.jsx se products list
  const amount = parsedData?.grandTotal || 0; // Checkout.jsx se grandTotal

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async (paymentId = "COD_OFFLINE") => {
    if (!selectedMethod && paymentId === "COD_OFFLINE") {
      Alert.alert(
        "Selection Required",
        "Please choose a payment method first.",
      );
      return;
    }

   setLoading(true);
  try {
    const orderPayload = {
      userEmail: selectedAddress?.email,
      items: products,
      totalAmount: amount,
      shippingAddress: selectedAddress,
      status: "Processing",
      paymentMethod: selectedMethod === "card" ? "Online" : "COD",
      paymentId: paymentId,
      createdAt: new Date(),
    };

      const response = await axios.post(`${API_BASE_URL}/place-order`, orderPayload);

      if (response.data.status) {
      await axios.delete(`${API_BASE_URL}/clear-cart/${selectedAddress?.email}`);

      router.replace("/components/OrderSuccess"); 
    }
    } catch (error) {
    Alert.alert("Error", "Order process nahi ho paya.");
  } finally {
    setLoading(false);
  }
};

  const openRazorpay = () => {
    const options = {
      key: "rzp_test_vv1FCZvuDRF6lQ",
      amount: (amount * 100).toString(),
      currency: "INR",
      name: "Your Store Name",
      description: "Purchase Payment",
      prefill: {
        email: selectedAddress?.email || "",
        contact: selectedAddress?.phone || "",
      },
      theme: { color: "#0aad0a" },
    };

    RazorpayCheckout.open(options)
      .then((res) => handlePlaceOrder(res.razorpay_payment_id))
      .catch((err) => Alert.alert("Payment Failed", err.description));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#2c3e50" />
        </TouchableOpacity>

        <Text style={styles.title}>Payment</Text>
        <Text style={styles.subtitle}>Finalize your order</Text>

        {/* --- Full Address Display --- */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Shipping To:</Text>
          {selectedAddress ? (
            <View>
              <Text style={styles.boldText}>{selectedAddress.fullName}</Text>
              <Text style={styles.addressText}>
                {selectedAddress.street}, {selectedAddress.city}
              </Text>
              <Text style={styles.addressText}>
                {selectedAddress.state} - {selectedAddress.zipCode}
              </Text>
              <Text style={styles.addressText}>
                Phone: {selectedAddress.phone}
              </Text>
            </View>
          ) : (
            <Text style={styles.errorText}>Address details missing!</Text>
          )}
        </View>

        {/* --- Amount Summary --- */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Order Total:</Text>
            <Text style={styles.amountValue}>₹{amount.toFixed(2)}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Select Method</Text>
        {PAYMENT_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionRow,
              selectedMethod === option.id && styles.selectedOption,
            ]}
            onPress={() => setSelectedMethod(option.id)}
          >
            <MaterialIcons
              name={option.icon}
              size={24}
              color={selectedMethod === option.id ? "#0aad0a" : "#7f8c8d"}
            />
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
            </View>
            {selectedMethod === option.id && (
              <Feather name="check-circle" size={20} color="#0aad0a" />
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[
            styles.payBtn,
            { opacity: loading || !selectedMethod ? 0.7 : 1 },
          ]}
          onPress={() =>
            selectedMethod === "card" ? openRazorpay() : handlePlaceOrder()
          }
          disabled={loading || !selectedMethod}
        >
          <Text style={styles.payBtnText}>
            {loading ? "Processing..." : `Place Order (₹${amount.toFixed(2)})`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20 },
  backBtn: { marginBottom: 15 },
  title: { fontSize: 26, fontWeight: "bold", color: "#2c3e50" },
  subtitle: { fontSize: 15, color: "#7f8c8d", marginBottom: 20 },
  card: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 8,
  },
  boldText: { fontSize: 15, fontWeight: "bold", color: "#333" },
  addressText: { fontSize: 14, color: "#555", marginTop: 2 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountValue: { fontSize: 20, fontWeight: "bold", color: "#0aad0a" },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },
  selectedOption: { borderColor: "#0aad0a", backgroundColor: "#f0fff0" },
  optionTitle: { fontSize: 15, fontWeight: "600" },
  optionSubtitle: { fontSize: 12, color: "#7f8c8d" },
  payBtn: {
    marginTop: 20,
    backgroundColor: "#001e2b",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  payBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  errorText: { color: "red", fontSize: 12 },
});

export default Payment;
