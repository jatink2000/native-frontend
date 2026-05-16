//===================================
//     AddCategory
//===================================
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Switch,
} from "react-native";
import axios from "axios";
import { API_BASE_URL } from "../../constants/api";
import * as ImagePicker from "expo-image-picker";

const AddCategory = () => {
  const [data, setData] = useState({
    name: "",
    image: "",
    status: "Active",
  });

  // Ek hi function form data update karne ke liye kaafi hai
  const handleInputChange = (name, value) => {
    setData({ ...data, [name]: value });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const mimeType = asset.mimeType;
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/svg+xml",
        "image/jpg",
      ];

      if (mimeType && allowedTypes.includes(mimeType)) {
        if (asset.base64) {
          let imageSrc = `data:${mimeType};base64,${asset.base64}`;
          handleInputChange("image", imageSrc);
        }
      } else {
        alert("Please select a valid image type (JPEG, PNG, SVG).");
      }
    }
  };

  const handleAddCategory = () => {
    axios
(`${API_BASE_URL}/categories`, data)
      .then((res) => {
        if (res.data.status) {
          alert("Category added successfully");
          // Reset form after success
          setData({ name: "", image: "", status: "Active" });
          window.location.reload();
        }
      })
      .catch((err) => {
        console.error("API Error: ", err);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Category</Text>

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

      <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
        <Text style={styles.addButtonText}>Add Category</Text>
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
  imagePicker: {
    width: "100%",
    height: 200,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
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

export default AddCategory;
