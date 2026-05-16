import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router"; // useFocusEffect ko add kiya
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../../constants/api";
import { CartContext } from "../../context/CartContext";
import { Feather } from "@expo/vector-icons";

const Checkout = () => {
  const router = useRouter();
  const { cart } = useContext(CartContext);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  // useFocusEffect se jab aap Address page se back aayenge toh list update ho jayegi
  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, []),
  );

  const fetchAddresses = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const email = storedUser ? JSON.parse(storedUser)?.email : null;

      if (!email) {
        setAddresses([]);
        setSelectedAddressId("");
        return;
      }

      const res = await axios.get(`${API_BASE_URL}/get-addresses/${email}`);
      const savedAddresses = res?.data?.addresses || [];
      setAddresses(savedAddresses);

      // Agar koi address selected nahi hai, tabhi default select karein
      if (!selectedAddressId) {
        const defaultAddress =
          savedAddresses.find((item) => item.isDefault) || savedAddresses[0];
        setSelectedAddressId(defaultAddress?._id || "");
      }
    } catch (_error) {
      setAddresses([]);
      setSelectedAddressId("");
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const totalAmount = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + (item.salePrice || 0) * (item.quantity || 1),
        0,
      ),
    [cart],
  );

  const handleProceed = () => {
    if (!cart.length) {
      Alert.alert("Cart is empty", "Please add products before checkout.");
      return;
    }

    if (!selectedAddressId) {
      Alert.alert(
        "Select address",
        "Please select one saved address to continue.",
      );
      return;
    }

    const selectedAddress = addresses.find(
      (item) => item._id === selectedAddressId,
    );
    router.push({
      pathname: "/components/Payment",
      params: {
        checkoutData: JSON.stringify({
          selectedAddress,
          checkoutProducts: cart.map((item) => ({
            productName: item.title || item.name || "Product",
            productCount: item.quantity || 1,
            productPrice: item.salePrice || 0,
            lineTotal: (item.salePrice || 0) * (item.quantity || 1),
          })),
          grandTotal: totalAmount,
        }),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2c3e50" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#2c3e50" />
          </TouchableOpacity>
          <Text style={styles.title}>Checkout</Text>
        </View>
        <Text style={styles.subtitle}>
          Select saved address and review products
        </Text>

        {/* --- Address Section Header with Add Button --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity
              style={styles.addNewBtn}
              onPress={() => router.push("/components/Address")}
            >
              <Feather name="plus-circle" size={18} color="#00b300" />
              <Text style={styles.addNewText}>Add New</Text>
            </TouchableOpacity>
          </View>

          {isLoadingAddresses ? (
            <Text style={styles.helperText}>Loading addresses...</Text>
          ) : addresses.length ? (
            addresses.map((item) => {
              const isSelected = item._id === selectedAddressId;
              return (
                <TouchableOpacity
                  key={item._id}
                  style={[
                    styles.addressCard,
                    isSelected && styles.selectedAddressCard,
                  ]}
                  onPress={() => setSelectedAddressId(item._id)}
                >
                  <View style={styles.addressHeader}>
                    <Feather
                      name={isSelected ? "check-circle" : "circle"}
                      size={18}
                      color={isSelected ? "#00b300" : "#95a5a6"}
                    />
                    <Text style={styles.addressType}>
                      {item.addressType || "Address"}
                    </Text>
                  </View>
                  <Text style={styles.addressLine}>{item.fullName}</Text>
                  <Text style={styles.addressLine}>
                    {item.street}, {item.city}, {item.state} {item.zipCode}
                  </Text>
                  <Text style={styles.addressLine}>{item.phone}</Text>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.noAddressWrap}>
              <Text style={styles.helperText}>No saved address found.</Text>
              <TouchableOpacity
                onPress={() => router.push("/components/Address")}
              >
                <Text style={styles.addAddressLink}>
                  + Click here to add an address
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Review Products</Text>
          {cart.length ? (
            <>
              {" "}
              {/* Yahan change kiya hai */}
              {cart.map((item) => (
                <View key={item._id} style={styles.productRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.productName}>
                      {item.title || item.name || "Product"}
                    </Text>
                    <Text style={styles.productMeta}>
                      Qty: {item.quantity || 1}
                    </Text>
                  </View>
                  <Text style={styles.productPrice}>
                    ₹{((item.salePrice || 0) * (item.quantity || 1)).toFixed(2)}
                  </Text>
                </View>
              ))}
              <View style={styles.grandTotalRow}>
                <Text style={styles.grandTotalLabel}>Grand Total</Text>
                <Text style={styles.grandTotalValue}>
                  ₹{totalAmount.toFixed(2)}
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.helperText}>Your cart is empty.</Text>
          )}
        </View>

        <TouchableOpacity style={styles.proceedBtn} onPress={handleProceed}>
          <Text style={styles.proceedBtnText}>Proceed To Payment</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 45, backgroundColor: "#fff" },
  content: { padding: 20, paddingBottom: 40 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  title: { fontSize: 24, fontWeight: "bold", marginLeft: 10, color: "#2c3e50" },
  subtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 15,
    marginLeft: 35,
  },
  section: {
    borderWidth: 1,
    borderColor: "#dcdde1",
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    backgroundColor: "#f8f9fa",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#2c3e50" },
  addNewBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fff4",
    padding: 5,
    borderRadius: 5,
  },
  addNewText: {
    color: "#00b300",
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 13,
  },
  addressCard: {
    borderWidth: 1,
    borderColor: "#dcdde1",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  selectedAddressCard: { borderColor: "#00b300", backgroundColor: "#f0fff4" },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  addressType: { marginLeft: 8, fontWeight: "700", color: "#2c3e50" },
  addressLine: { fontSize: 13, color: "#34495e", marginTop: 2 },
  noAddressWrap: { paddingVertical: 10, alignItems: "center" },
  addAddressLink: { color: "#00b300", fontWeight: "700", marginTop: 8 },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  productName: { fontSize: 14, fontWeight: "600", color: "#2c3e50" },
  productMeta: { fontSize: 12, color: "#7f8c8d", marginTop: 2 },
  productPrice: { fontSize: 14, fontWeight: "700", color: "#2c3e50" },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  grandTotalLabel: { fontSize: 16, fontWeight: "700", color: "#2c3e50" },
  grandTotalValue: { fontSize: 16, fontWeight: "700", color: "#00b300" },
  proceedBtn: {
    marginTop: 10,
    backgroundColor: "#001e2b",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  proceedBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  helperText: { fontSize: 14, color: "#7f8c8d" },
});

export default Checkout;
