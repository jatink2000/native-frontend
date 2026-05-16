//===================================
//     Edit Users
//===================================
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";
import { API_BASE_URL } from "../../constants/api";
import { useLocalSearchParams, useRouter } from "expo-router";

const EditUsers = () => {
  const router = useRouter();
  const { user: userString } = useLocalSearchParams();
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (userString) {
      setData(JSON.parse(userString));
    }
  }, [userString]);

  const handleInputChange = (name, value) => {
    setData({ ...data, [name]: value });
  };

  
  // update user
  const handleUpdate = () => {
    axios.put(`${API_BASE_URL}/users/${data._id}`, data).then((res) => {
      if (res.data.status) {
        Alert.alert("User updated successfully");
        router.back();
      } else {
        Alert.alert(res.data.message || "An error occurred while updating the user.");
      }
    })
    .catch((err) => {
        Alert.alert(err?.message || "An error occurred while updating the user.");
        console.error("API Error: ", err);
        router.back();
    });
  };







  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      <Text style={styles.title}>Edit User</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>User Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter user name"
          value={data.name}
          onChangeText={(text) => handleInputChange("name", text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>User Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter user email"
          value={data.email}
          onChangeText={(text) => handleInputChange("email", text)}
          keyboardType="default"
          autoCapitalize="none"
        />
      </View>   

      <View style={styles.inputContainer}>
        <Text style={styles.label}>User Phone</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter user phone"
          value={data.phone}
          onChangeText={(text) => handleInputChange("phone", text)}
          keyboardType="numeric"
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleUpdate}>
        <Text style={styles.addButtonText}>Save Changes</Text>
      </TouchableOpacity>
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
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EditUsers;
