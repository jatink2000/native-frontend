//===================================
//     Cart
//===================================
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { CartContext } from "../../context/CartContext";
import EmptyCart from "../emptyCart";
import { API_BASE_URL } from "../../constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

function Cart() {
  const router = useRouter();
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart, total } =
    useContext(CartContext);
  const [zipCode, setZipCode] = useState("");

  useEffect(() => {
    const loadDefaultZip = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const email = storedUser ? JSON.parse(storedUser)?.email : null;
        if (!email) {
          setZipCode("");
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/get-addresses/${email}`);
        const addresses = res.data?.addresses || [];
        const defaultAddress =
          addresses.find((a) => a.isDefault) || addresses[0];
        setZipCode(
          defaultAddress?.zipCode ? String(defaultAddress.zipCode) : "",
        );
      } catch (_e) {
        setZipCode("");
      }
    };

    loadDefaultZip();
  }, []);

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Shop Cart</Text>
          <Text style={styles.headerSubtitle}>
            {zipCode ? `Location in ${zipCode}` : "Location"}
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="close" size={24} color="#7f8c8d" />
        </TouchableOpacity>
      </View>

      {/* Free Delivery Banner */}
      <View style={styles.bannerContainer}>
        <Text style={styles.bannerText}>
          You have got FREE delivery. Start{" "}
          <Text style={{ fontWeight: "bold" }}>checkout now!</Text>
        </Text>
      </View>

      {/* Cart Items List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {cart
          .filter((item) => item)
          .map((item) => (
            <View key={item._id} style={styles.cartItem}>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/ProductDetail",
                    params: { item: JSON.stringify(item) },
                  })
                }
              >
                <Image
                  source={{ uri: item.image || item.thumbnail }}
                  style={styles.productImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.productInfo}
                onPress={() =>
                  router.push({
                    pathname: "/ProductDetail",
                    params: { item: JSON.stringify(item) },
                  })
                }
              >
                <Text style={styles.productTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                {item.weight && (
                  <Text style={styles.productWeight}>{item.weight}</Text>
                )}

                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeFromCart(item)}
                >
                  <Feather name="trash-2" size={14} color="#27ae60" />
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </TouchableOpacity>
              <View style={styles.priceSection}>
                <View style={styles.qtyContainer}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => decreaseQuantity(item)}
                  >
                    <Text style={styles.qtyBtnText}>-</Text>
                  </TouchableOpacity>
                  <View style={styles.qtyValueContainer}>
                    <Text style={styles.qtyValue}>{item.quantity}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => increaseQuantity(item)}
                  >
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.priceText}>
                  ₹{(item.salePrice * item.quantity).toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
      </ScrollView>

      {/* Fixed Bottom Footer for Buttons */}
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.subtotalText}>Subtotal</Text>
          <Text style={styles.totalPriceText}>₹{total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => router.push("/components/Checkout")}
        >
          <Text style={styles.checkoutBtnText}>Proceed To Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 45, backgroundColor: "#fff" },

  // Empty Cart Styles
  emptyContainer: {
    flex: 1,
    marginTop: 45,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 30,
  },
  startShoppingBtn: {
    backgroundColor: "#00b82b",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  startShoppingText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  // Premium Cart Styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#2c3e50" },
  headerSubtitle: { fontSize: 13, color: "#7f8c8d", marginTop: 2 },
  bannerContainer: {
    backgroundColor: "#fce8e8",
    margin: 15,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fadbd8",
  },
  bannerText: { color: "#c0392b", fontSize: 14 },
  scrollContent: { paddingHorizontal: 15, paddingBottom: 20 },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  productImage: { width: 60, height: 60, marginRight: 15 },
  productInfo: { flex: 1 },
  productTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  productWeight: { fontSize: 13, color: "#7f8c8d", marginBottom: 6 },
  removeBtn: { flexDirection: "row", alignItems: "center" },
  removeText: { fontSize: 13, color: "#7f8c8d", marginLeft: 4 },
  priceSection: { alignItems: "flex-end" },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ecf0f1",
    borderRadius: 4,
    marginBottom: 15,
  },
  qtyBtn: { paddingHorizontal: 10, paddingVertical: 5 },
  qtyBtnText: { fontSize: 16, color: "#7f8c8d" },
  qtyValueContainer: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ecf0f1",
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  qtyValue: { fontSize: 14, fontWeight: "bold", color: "#2c3e50" },
  priceText: { fontSize: 16, fontWeight: "bold", color: "#000" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#ecf0f1",
    backgroundColor: "#fff",
  },
  priceContainer: { flex: 1, marginRight: 10 },
  subtotalText: { fontSize: 14, color: "#7f8c8d" },
  totalPriceText: { fontSize: 20, fontWeight: "bold", color: "#2c3e50" },
  checkoutBtn: {
    backgroundColor: "#001e2b",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 6,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  checkoutBtnText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
});

export default Cart;
