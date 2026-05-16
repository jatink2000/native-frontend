//===================================
//     EditCategory
//===================================
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";
import axios from "axios";
import { API_BASE_URL } from "../../constants/api";
import { useLocalSearchParams, useRouter } from "expo-router";

const EditCategory = () => {
  const router = useRouter();
  const { category: categoryString } = useLocalSearchParams();
  const [data, setData] = useState({
    name: "",
    image: "",
    status: "Active",
  });

  useEffect(() => {
    if (categoryString) {
      setData(JSON.parse(categoryString));
    }
  }, [categoryString]);

  const handleInputChange = (name, value) => {
    setData({ ...data, [name]: value });
  };

  const handleUpdateCategory = () => {
    axios
      .put(`${API_BASE_URL}/categories/${data._id}`, data)
      .then((res) => {
        if (res.data.status) {
          alert("Category updated successfully");
          router.back();
        }
      })
      .catch((err) => {
        console.error("API Error: ", err);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Category</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter category name"
          value={data.name}
          onChangeText={(text) => handleInputChange("name", text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category Image URL</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter category Image url"
          value={data.image}
          onChangeText={(text) => handleInputChange("image", text)}
          keyboardType="default"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status</Text>
        <Switch
          value={data.status === "Active"}
          onValueChange={(value) =>
            handleInputChange("status", value ? "Active" : "Inactive")
          }
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleUpdateCategory}>
        <Text style={styles.addButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
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
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 16,
    marginRight: 10,
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

export default EditCategory;
