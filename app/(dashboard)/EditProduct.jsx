//===================================
//     EditProduct
//===================================
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect, useContext } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Switch,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";
import { ProductsDashboardContext } from "../../context/ProductsDashboardContext";

function CustomRadioButton({ label, selected, onSelect }) {
  return (
    <TouchableOpacity style={styles.radioContainer} onPress={onSelect}>
      <View
        style={[styles.radioButton, selected && styles.radioButtonSelected]}
      >
        {selected && <View style={styles.radioButtonInner} />}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function EditProduct() {
  const router = useRouter();
  const { product: productString } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const { updateProductInCart } = useContext(CartContext);
  const { updateProductInWishlist } = useContext(WishlistContext);
  const { updateProduct } = useContext(ProductsDashboardContext);

  useEffect(() => {
    if (productString) {
      setProduct(JSON.parse(productString));
    }
    fetchCategories();
  }, [productString]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:8080/categories");
      const data = await response.json();
      if (data.status) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const inputvalue = (name, value) => {
    setProduct({ ...product, [name]: value });
  };

  const handleUpdate = async () => {
    const productData = {
      ...product,
      weight: parseFloat(product.weight) || 0,
      regularPrice: parseFloat(product.regularPrice) || 0,
      salePrice: parseFloat(product.salePrice) || 0,
    };
    try {
      const updated = await updateProduct(product._id, productData);
      alert("Product updated successfully");
      if (updated) {
        updateProductInCart(updated);
        updateProductInWishlist(updated);
      }
      router.back();
    } catch (err) {
      console.error("API Error: ", err);
      alert(err?.message || "An error occurred while updating the product.");
    }
  };

  if (!product) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      <Text style={styles.title}>Edit Product</Text>

      <View style={styles.formColumns}>
        <View style={styles.leftColumn}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Information</Text>
            <View style={styles.grid2Col}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Product Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter product title"
                  value={product.title}
                  onChangeText={(text) => inputvalue("title", text)}
                  keyboardType="default"
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Weight</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter product Weight"
                  value={String(product.weight)}
                  onChangeText={(text) => inputvalue("weight", text)}
                  keyboardType="numeric"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Product Image url</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter product Image url"
              value={product.image}
              onChangeText={(text) => inputvalue("image", text)}
              keyboardType="default"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Descriptions</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Enter description"
                value={product.description}
                onChangeText={(text) => inputvalue("description", text)}
                multiline={true}
                numberOfLines={6}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nutrient Value & Benefits</Text>
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Enter nutrient value and benefits"
                value={product.nutrientValueBenefits || ""}
                onChangeText={(text) => inputvalue("nutrientValueBenefits", text)}
                multiline={true}
                numberOfLines={4}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Storage Tips</Text>
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Enter storage tips"
                value={product.storageTips || ""}
                onChangeText={(text) => inputvalue("storageTips", text)}
                multiline={true}
                numberOfLines={4}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Seller</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter seller name"
                value={product.sellerName || ""}
                onChangeText={(text) => inputvalue("sellerName", text)}
              />
            </View>
          </View>
        </View>

        <View style={styles.rightColumn}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Product Category</Text>
            <Picker
              style={styles.input}
              selectedValue={product.category}
              onValueChange={(value) => {
                inputvalue("category", value);
              }}
            >
              <Picker.Item
                label="Enter product Category"
                value=""
                enabled={false}
              />
              {categories.map((category) => (
                <Picker.Item
                  key={category._id}
                  label={category.name}
                  value={category.name}
                />
              ))}
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Weight Units</Text>
            <Picker
              style={styles.input}
              selectedValue={product.unit}
              onValueChange={(value) => {
                inputvalue("unit", value);
              }}
            >
              <Picker.Item label="Select Units" value="" enabled={false} />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="500g" value="500g" />
              <Picker.Item label="1kg" value="1kg" />
              <Picker.Item label="2kg" value="2kg" />
              <Picker.Item label="5kg" value="5kg" />
            </Picker>
          </View>

          <View style={styles.complexStockSection}>
            <View style={styles.switchContainer}>
              <Switch
                trackColor={{ false: "#767577", true: "#10ac84" }}
                thumbColor={product.stockStatus ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(value) => inputvalue("stockStatus", value)}
                value={product.stockStatus}
              />
              <Text style={styles.switchLabel}>In Stock</Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Product Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Product Code"
                value={product.productCode}
                onChangeText={(text) => inputvalue("productCode", text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Product SKU</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Product SKU"
                value={product.productSku}
                onChangeText={(text) => inputvalue("productSku", text)}
              />
            </View>
            <View style={styles.statusSection}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.radioGrid}>
                <CustomRadioButton
                  label="Active"
                  selected={product.status === "Active"}
                  onSelect={() => inputvalue("status", "Active")}
                />
                <CustomRadioButton
                  label="Disabled"
                  selected={product.status === "Disabled"}
                  onSelect={() => inputvalue("status", "Disabled")}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Price</Text>
            <View style={styles.grid2Col}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Regular Price</Text>
                <TextInput
                  style={styles.input}
                  placeholder="₹0.00"
                  value={String(product.regularPrice)}
                  onChangeText={(text) => inputvalue("regularPrice", text)}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Sale Price</Text>
                <TextInput
                  style={styles.input}
                  placeholder="₹0.00"
                  value={String(product.salePrice)}
                  onChangeText={(text) => inputvalue("salePrice", text)}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.signupBtn} onPress={handleUpdate}>
        <Text style={styles.signupText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  formColumns: { flexDirection: "row", gap: 20, marginTop: 10 },
  leftColumn: { flex: 2, gap: 15 },
  rightColumn: { flex: 1, gap: 15 },
  section: {
    borderWidth: 1,
    borderColor: "#dcdde1",
    borderRadius: 8,
    padding: 15,
    backgroundColor: "#f8f9fa",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#34495e",
    marginBottom: 12,
  },
  grid2Col: { flexDirection: "row", gap: 15 },
  inputContainer: { flex: 1, marginBottom: 10 },
  label: { fontSize: 14, color: "#34495e", marginBottom: 5, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#dcdde1",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  descriptionInput: { height: 120, textAlignVertical: "top" },
  complexStockSection: { gap: 10 },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  switchLabel: {
    fontSize: 14,
    color: "#34495e",
    fontWeight: "600",
    marginLeft: 8,
  },
  statusSection: { marginBottom: 10 },
  radioGrid: { flexDirection: "row", gap: 15 },
  radioContainer: { flexDirection: "row", alignItems: "center" },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#10ac84",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioButtonSelected: { backgroundColor: "#fff" },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#10ac84",
  },
  radioLabel: { fontSize: 14, color: "#34495e" },
  signupBtn: {
    backgroundColor: "#10ac84",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  signupText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default EditProduct;