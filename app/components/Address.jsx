import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../../constants/api";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

const AddressScreen = () => {
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    country: "India",
    addressType: "Home",
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const { email } = JSON.parse(storedUser);
        setUserEmail(email);
        const res = await axios.get(`${API_BASE_URL}/get-addresses/${email}`);
        if (res.data.status) setAddresses(res.data.addresses);
      }
    } catch (error) {
      console.error("Axios Network Error Detail:", error.message);
      Alert.alert(
        "Network Error",
        "Server se connect nahi ho paya. IP check karein.",
      );
    }
  };

  // Add New Address Function
  const resetForm = () => {
    setFormData({
      fullName: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      country: "India",
      addressType: "Home",
    });
    setEditingAddressId(null);
  };

  const handleAddAddress = async () => {
    if (
      !formData.fullName ||
      !formData.street ||
      !formData.city ||
      !formData.phone
    ) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    const payload = { ...formData, email: userEmail };

    try {
      const res = editingAddressId
        ? await axios.put(
            `${API_BASE_URL}/update-address/${editingAddressId}`,
            payload,
          )
        : await axios.post(`${API_BASE_URL}/add-address`, payload);
      if (res.data.status) {
        Alert.alert(
          "Success",
          editingAddressId
            ? "Address updated successfully!"
            : "Address added successfully!",
        );
        setModalVisible(false); // Close Modal
        resetForm();
        fetchAddresses(); // Refresh List
      }
    } catch (_error) {
      Alert.alert(
        "Error",
        editingAddressId ? "Could not update address" : "Could not add address",
      );
    }
  };

  const setDefault = async (id) => {
    const res = await axios.post(`${API_BASE_URL}/set-default-address`, {
      id,
      email: userEmail,
    });
    if (res.data.status) fetchAddresses();
  };

  const handleEditAddress = (address) => {
    setEditingAddressId(address._id);
    setFormData({
      fullName: address.fullName || "",
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      zipCode: address.zipCode || "",
      phone: address.phone || "",
      country: address.country || "India",
      addressType: address.addressType || "Home",
    });
    setModalVisible(true);
  };

  const deleteAddress = (id) => {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          console.log("Deleting address with id:", id);
          try {
            const res = await axios.delete(
              `${API_BASE_URL}/deleteAddress/${id}`,
            );
            if (res.data?.status) {
              Alert.alert("Success", "Address deleted successfully!");
              setAddresses((prev) => prev.filter((item) => item._id !== id));
              fetchAddresses();
            } else {
              Alert.alert(
                "Error",
                res.data?.message || "Could not delete address",
              );
            }
          } catch (_error) {
            Alert.alert("Error", "Could not delete address");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.title}>Address</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addBtnText}>Add address</Text>
        </TouchableOpacity>
      </View>

      {/* Address Cards List */}
      <ScrollView
        style={{ flex: 1, marginLeft: 20 }}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollContent}
      >
        {addresses.length > 0 ? (
          addresses.map((item) => (
            <View key={item._id} style={styles.card}>
              <View style={styles.typeRow}>
                <MaterialCommunityIcons
                  name={item.isDefault ? "radiobox-marked" : "radiobox-blank"}
                  size={20}
                  color={item.isDefault ? "#00b300" : "#bdc3c7"}
                />
                <Text style={styles.typeText}>{item.addressType}</Text>
              </View>
              <Text style={styles.nameText}>{item.fullName}</Text>
              <Text
                style={styles.addressText}
              >{`${item.street}, ${item.city}, ${item.state}, ${item.country || "India"},`}</Text>
              <Text
                style={styles.addressText}
              >{` ${item.zipCode} | ${item.phone}`}</Text>
              {item.isDefault ? (
                <View style={styles.defaultLabel}>
                  <Text style={styles.defaultLabelText}>Default address</Text>
                </View>
              ) : (
                <TouchableOpacity onPress={() => setDefault(item._id)}>
                  <Text style={styles.setAsDefaultText}>Set as Default</Text>
                </TouchableOpacity>
              )}

              <View style={styles.actionRow}>
                <TouchableOpacity onPress={() => handleEditAddress(item)}>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteAddress(item._id)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={{ color: "#95a5a6", marginTop: 20 }}>
            No addresses found. Add one!
          </Text>
        )}
      </ScrollView>

      {/* --- ADD ADDRESS MODAL (FORM) --- */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header with Back Button */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.backBtn}
              >
                <Feather name="arrow-left" size={24} color="#2c3e50" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {editingAddressId ? "Edit Address" : "Add New Address"}
              </Text>
              <View style={{ width: 24 }} />{" "}
              {/* To balance the title in center */}
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={formData.fullName}
                onChangeText={(t) => setFormData({ ...formData, fullName: t })}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(t) => setFormData({ ...formData, phone: t })}
              />
              <TextInput
                style={styles.input}
                placeholder="Street / House No."
                value={formData.street}
                onChangeText={(t) => setFormData({ ...formData, street: t })}
              />
              <TextInput
                style={styles.input}
                placeholder="City"
                value={formData.city}
                onChangeText={(t) => setFormData({ ...formData, city: t })}
              />
              <TextInput
                style={styles.input}
                placeholder="State"
                value={formData.state}
                onChangeText={(t) => setFormData({ ...formData, state: t })}
              />
              <TextInput
                style={styles.input}
                placeholder="Zip Code"
                keyboardType="numeric"
                value={formData.zipCode}
                onChangeText={(t) => setFormData({ ...formData, zipCode: t })}
              />
              <Text style={styles.label}>Country:</Text>
              <View style={styles.pickerWrap}>
                <Picker
                  selectedValue={formData.country}
                  onValueChange={(value) =>
                    setFormData({ ...formData, country: value })
                  }
                >
                  <Picker.Item label="India" value="India" />
                  <Picker.Item label="Pakistan" value="Pakistan" />
                  <Picker.Item label="USA" value="USA" />
                  <Picker.Item label="China" value="China" />
                  <Picker.Item label="UK" value="UK" />
                </Picker>
              </View>
              <Text style={styles.label}>Address Type:</Text>
              <View style={styles.typeContainer}>
                {["Home", "Office"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeOption,
                      formData.addressType === type && styles.typeSelected,
                    ]}
                    onPress={() =>
                      setFormData({ ...formData, addressType: type })
                    }
                  >
                    <Text
                      style={[
                        styles.typeOptionText,
                        formData.addressType === type && { color: "#fff" },
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleAddAddress}
              >
                <Text style={styles.submitBtnText}>
                  {editingAddressId ? "Update Address" : "Save Address"}
                </Text>
              </TouchableOpacity>

              {/* Optional: Neeche wala Cancel Button aap hata bhi sakte hain ab */}
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={styles.cancelBtnText}>Discard Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 45, backgroundColor: "#fff", padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#2c3e50" },
  addBtn: {
    borderWidth: 1,
    borderColor: "#00b300",
    borderRadius: 8,
    marginTop: 10,
    marginRight: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  addBtnText: { color: "#00b300", fontWeight: "600" },
  scrollContent: { paddingRight: 20, flexDirection: "column" },
  card: {
    width: 380,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    marginBottom: 10,
    borderRadius: 12,
    padding: 20,
    marginRight: 20,
    backgroundColor: "#fff",
    elevation: 2,
  },
  typeRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  typeText: {
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 16,
    color: "#2c3e50",
  },
  nameText: { fontSize: 15, color: "#7f8c8d", marginBottom: 5 },
  addressText: { fontSize: 15, color: "#7f8c8d", lineHeight: 22 },
  defaultLabel: {
    backgroundColor: "#007bff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginVertical: 15,
  },
  defaultLabelText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  setAsDefaultText: {
    color: "#00b300",
    fontWeight: "bold",
    marginVertical: 15,
  },
  actionRow: { flexDirection: "row", marginTop: 10 },
  editText: { color: "#2c3e50", marginRight: 15, fontWeight: "500" },
  deleteText: { color: "#e74c3c", fontWeight: "500" },

  // --- MODAL STYLES ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    maxHeight: "80%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#dcdde1",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#2c3e50",
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: "#dcdde1",
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
  },
  typeContainer: { flexDirection: "row", marginBottom: 20 },
  typeOption: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#00b300",
    marginRight: 10,
  },
  typeSelected: { backgroundColor: "#00b300" },
  typeOptionText: { color: "#00b300", fontWeight: "bold" },
  submitBtn: {
    backgroundColor: "#00b300",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  submitBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  cancelBtn: { marginTop: 15, alignItems: "center" },
  cancelBtnText: { color: "#e74c3c", fontSize: 16, fontWeight: "600" },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 10,
  },
  backBtn: { padding: 5 },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    flex: 1,
  },
});

export default AddressScreen;
