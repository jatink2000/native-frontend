import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "../../constants/api";
import { Feather } from "@expo/vector-icons";

const AccountSetting = () => {
  const router = useRouter();
  // Form States
  const [user, setUser] = useState({ name: "", email: "", phone: "" });
  const [passwords, setPasswords] = useState({ new: "", current: "" });

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure? This will permanently delete your account and all data.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete Account", 
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${API_BASE_URL}/users/${user.email}`);
              await AsyncStorage.removeItem("user");
              router.replace("/Signup");
              Alert.alert("Account Deleted", "Your account has been deleted.");
            } catch (error) {
              console.log("Delete error:", error);
              Alert.alert("Error", "Failed to delete account.");
            }
          }
        },
      ],
    );
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const email = parsedUser?.email || "";

          setUser((prev) => ({
            ...prev,
            email,
            name: parsedUser?.name || prev.name,
            phone: parsedUser?.phone || prev.phone,
          }));

          const response = await axios.get(
            `${API_BASE_URL}/get-user/${email}`,
          );

          if (response.data.status) {
            setUser({
              name: response.data.user.name || "",
              email: response.data.user.email || "",
              phone: response.data.user.phone || "",
            });
          }
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        console.error("Using locally saved profile data.");
      }
    };
    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    if (!user.name || !user.phone) {
      Alert.alert("Wait", "Please fill all details!");
      return;
    }

try {
  // API call to update details
  const response = await axios.post(`${API_BASE_URL}/update-profile`, {
    name: user.name,
    email: user.email,
    phone: user.phone,
  });

      if (response.data.status) {
        Alert.alert("Success ✨", "Details updated successfully!");
        await AsyncStorage.setItem(
          "user",
          JSON.stringify(response.data.updatedUser),
        );
      } else {
        Alert.alert("Failed", response.data.message || "Update nahi ho paya.");
      }
    } catch (error) {
      console.log("Update Error:", error);
      Alert.alert("Error", "Server connection failed!");
    }
  };

  // Reset Password Logic
  const handleSavePassword = async () => {
    if (!passwords.new || !passwords.current) {
      Alert.alert("Error", "Please fill both password fields!");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/resetpassword`, {
        email: user.email,
        password: passwords.new,
        // cpassword: passwords.new // Agar confirm password match karana hai toh
      });

      if (response.data.status) {
        Alert.alert("Success ✨", "Password updated successfully!");
        setPasswords({ new: "", current: "" }); // Fields clear kar dein
      } else {
        Alert.alert(
          "Failed",
          response.data.message || "Password update nahi ho paya.",
        );
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong with the server!");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.backBtn}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#2c3e50" />
          </TouchableOpacity>
        <Text style={styles.mainTitle}>Account Setting</Text>
        </View>

        {/* --- Account Details Section --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={user.name}
              onChangeText={(val) => setUser({ ...user, name: val })}
              placeholder="Enter your name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: "#f5f5f5", color: "#7f8c8d" },
              ]}
              value={user.email}
              editable={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={user.phone}
              keyboardType="phone-pad"
              onChangeText={(val) => setUser({ ...user, phone: val })}
              placeholder="Enter phone number"
            />
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
            <Text style={styles.saveBtnText}>Save Details</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* --- Updated Password Section --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Password</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password</Text>
            <TextInput 
              style={styles.input} 
              placeholder="**********" 
              secureTextEntry 
              value={passwords.new}
              onChangeText={(t) => setPasswords({...passwords, new: t})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Password</Text>
            <TextInput 
              style={styles.input} 
              placeholder="**********" 
              secureTextEntry 
              value={passwords.current}
              onChangeText={(t) => setPasswords({...passwords, current: t})}
            />
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSavePassword}>
            <Text style={styles.saveBtnText}>Save Password</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* --- Delete Account Section --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delete Account</Text>
          <Text style={styles.subText}>
            Would you like to delete your account?
          </Text>
          <Text style={styles.warningText}>
            This account contain 12 orders, Deleting your account will remove
            all the order details associated with it.
          </Text>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteBtnText}>
              I want to delete my account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 45,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  mainTitle: {
    marginTop: 10,
    fontSize: 26,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#34495e",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 48,
    fontSize: 15,
    color: "#2c3e50",
    backgroundColor: "#fcfcfc",
  },
  saveBtn: {
    backgroundColor: "#00b300", // Green color from your image
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 30,
  },
  forgotText: {
    fontSize: 13,
    color: "#7f8c8d",
    marginBottom: 15,
    lineHeight: 20,
  },
  linkText: {
    color: "#00b300",
    fontWeight: "600",
  },
  subText: {
    fontSize: 14,
    color: "#2c3e50",
    fontWeight: "600",
    marginBottom: 10,
  },
  warningText: {
    fontSize: 14,
    color: "#7f8c8d",
    lineHeight: 22,
    marginBottom: 20,
  },
  deleteBtn: {
    borderWidth: 1,
    borderColor: "#e74c3c",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  deleteBtnText: {
    color: "#e74c3c",
    fontWeight: "600",
  },
});

export default AccountSetting;
