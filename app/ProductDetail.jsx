//===================================
//     ProductDetail
//===================================
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import ProductInfoTabs from "./components/ProductInfoTabs";

export default function ProductDetail() {
  const { item } = useLocalSearchParams();
  const router = useRouter();
  const { cart, addToCart } = useContext(CartContext);
  const { wishlist, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);

  let product = {};
  try {
    product = JSON.parse(item);
  } catch (e) {
    console.log("Error parsing product data", e);
  }

  // States
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState("250g");

  // Images array setup
  const images = [
    product.image || product.thumbnail || "https://via.placeholder.com/300",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
  ].filter(Boolean);

  const [mainImage, setMainImage] = useState(images[0]);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconButton}
        >
          <AntDesign name="arrow-left" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/Cart")}
          style={styles.iconButton}
        >
          <Feather name="shopping-cart" size={24} color="#2c3e50" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60, paddingHorizontal: 20 }}
      >
        <View style={styles.rowLayout}>
          {/* ================= LEFT SIDE (IMAGES) ================= */}
          <View style={styles.leftColumn}>
            {/* Main Image */}
            <View style={styles.imageBackground}>
              <Image
                source={{ uri: mainImage }}
                style={styles.mainImage}
                resizeMode="contain"
              />
            </View>

            {/* Thumbnail Gallery */}
            <View style={styles.thumbnailContainer}>
              {images.map((img, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setMainImage(img)}
                  style={[
                    styles.thumbnailWrapper,
                    mainImage === img && styles.activeThumbnail,
                  ]}
                >
                  <Image
                    source={{ uri: img }}
                    style={styles.thumbnailImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ================= RIGHT SIDE (DETAILS) ================= */}
          <View style={styles.rightColumn}>
            <Text style={styles.categoryText}>
              {product.category || "Snack & Munchies"}
            </Text>
            <Text style={styles.title}>
              {product.title || "Haldiram's Sev Bhujia"}
            </Text>

            <View style={styles.ratingRow}>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <AntDesign key={i} name="star" size={14} color="#f39c12" />
                ))}
              </View>
              <Text style={styles.reviewText}> (4 reviews)</Text>
            </View>

            {/* Price */}
            <View style={styles.priceRow}>
              <Text style={styles.currentPrice}>
                ₹{product.salePrice || product.price || "21.6"}
              </Text>
              <Text style={styles.oldPrice}>
                ₹{product.regularPrice || "24.0"}
              </Text>
              <Text style={styles.discountText}>10% Off</Text>
            </View>

            <View style={styles.dividerLight} />

            {/* Weight Selectors */}
            <View style={styles.weightRow}>
              {["250g", "500g", "1kg"].map((weight) => (
                <TouchableOpacity
                  key={weight}
                  style={[
                    styles.weightBox,
                    selectedWeight === weight && styles.activeWeightBox,
                  ]}
                  onPress={() => setSelectedWeight(weight)}
                >
                  <Text
                    style={[
                      styles.weightText,
                      selectedWeight === weight && styles.activeWeightText,
                    ]}
                  >
                    {weight}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Quantity Selector */}
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={decreaseQuantity}
              >
                <Feather name="minus" size={18} color="#2c3e50" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={increaseQuantity}
              >
                <Feather name="plus" size={18} color="#2c3e50" />
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              {cart.find((c) => c._id === product._id) ? (
                <TouchableOpacity
                  style={styles.addCartBtn}
                  onPress={() => router.push("/Cart")}
                >
                  <Text style={styles.addCartText}>Go to cart</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.addCartBtn}
                  onPress={() => addToCart(product)}
                >
                  <Feather
                    name="shopping-bag"
                    size={18}
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.addCartText}>Add to cart</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.iconActionBtn}
                onPress={() => {
                  if (wishlist.find((w) => w._id === product._id)) {
                    removeFromWishlist(product);
                  } else {
                    addToWishlist(product);
                  }
                }}
              >
                <Feather
                  name={"heart"}
                  size={20}
                  color={
                    wishlist.find((w) => w._id === product._id)
                      ? "#ff0000"
                      : "#2c3e50"
                  }
                  fill={
                    wishlist.find((w) => w._id === product._id)
                      ? "#ff0000"
                      : "none"
                  }
                />
              </TouchableOpacity>
            </View>

            <View style={styles.dividerLight} />

            {/* Info Table */}
            <View style={styles.infoTable}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Product Code:</Text>
                <Text style={styles.infoValue}>
                  {product.productSku || "FBB00255"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Availability:</Text>
                <Text style={styles.infoValue}>
                  {product.stockStatus !== false ? "In Stock" : "Out of Stock"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Type:</Text>
                <Text style={styles.infoValue}>
                  {product.category || "Fruits"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Shipping:</Text>
                <Text style={styles.infoValue}>
                  01 day shipping.{" "}
                  <Text style={styles.lightText}>(Free pickup today)</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
        <ProductInfoTabs productId={product._id} initialProduct={product} />
        <View style={styles.dividerLight} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 45, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  iconButton: { padding: 8 },

  // Web-like Row Layout Setup
  rowLayout: {
    flexDirection: "row", // Ye left-right set karega
    flexWrap: "wrap", // Agar screen choti hogi to automatically neeche aa jayega
    marginTop: 20,
    gap: 30, // Left aur Right column ke beech ki jagah
  },

  leftColumn: {
    flex: 1,
    minWidth: 300, // Desktop par bada aur mobile par full width
  },

  rightColumn: {
    flex: 1,
    minWidth: 300,
    paddingTop: 10,
  },

  // Image Styles
  imageBackground: {
    backgroundColor: "#f8f2e8", // Tumhari image jaisa soft background
    width: "100%",
    height: 400,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  mainImage: { width: "80%", height: "80%" },

  thumbnailContainer: { flexDirection: "row", marginTop: 15 },
  thumbnailWrapper: {
    width: 80,
    height: 80,
    backgroundColor: "#f8f2e8",
    borderRadius: 8,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  activeThumbnail: { borderColor: "#10ac84" },
  thumbnailImage: { width: "80%", height: "80%" },

  // Detail Styles
  categoryText: {
    color: "#0aad0a",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 12,
    lineHeight: 36,
  },

  ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  stars: { flexDirection: "row" },
  reviewText: { color: "#0aad0a", fontSize: 14, marginLeft: 8 },

  priceRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  currentPrice: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0f172a",
    marginRight: 12,
  },
  oldPrice: {
    fontSize: 20,
    color: "#94a3b8",
    textDecorationLine: "line-through",
    marginRight: 12,
  },
  discountText: { color: "#e74c3c", fontSize: 15, fontWeight: "bold" },

  dividerLight: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 20 },

  weightRow: { flexDirection: "row", marginBottom: 20 },
  weightBox: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 12,
  },
  activeWeightBox: { borderColor: "#10ac84", backgroundColor: "#eafaf1" },
  weightText: { color: "#64748b", fontSize: 14, fontWeight: "500" },
  activeWeightText: { color: "#10ac84", fontWeight: "bold" },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    width: 130,
    marginBottom: 25,
  },
  qtyBtn: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    flex: 1,
    textAlign: "center",
  },

  actionRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  addCartBtn: {
    backgroundColor: "#0aad0a",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginRight: 15,
  },
  addCartText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  iconActionBtn: {
    backgroundColor: "#f1f5f9",
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },

  infoTable: { marginTop: 10 },
  infoRow: { flexDirection: "row", marginBottom: 12 },
  infoLabel: { width: 130, color: "#64748b", fontSize: 14 },
  infoValue: { flex: 1, color: "#0f172a", fontSize: 14, fontWeight: "500" },
  lightText: { color: "#94a3b8", fontWeight: "400" },
  discription: { marginTop: 10 },
});
