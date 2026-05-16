import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  useWindowDimensions,
  ActivityIndicator,
  Image,
} from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { API_BASE_URL } from "../../constants/api";
import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import axios from "axios";

function Index() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const styles = getStyles(width);
  const { cart, addToCart } = useContext(CartContext);
  const { wishlist, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);

  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);


  // fetchProducts function
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/products`),
        axios.get(`${API_BASE_URL}/categories`),
      ]);
      
      if (productsRes.data.status) {
        setData(productsRes.data.products || []);

        // Use categories from API if available
        let categoryList = [];
        if (categoriesRes.data.status && categoriesRes.data.categories) {
          categoryList = categoriesRes.data.categories.map((cat) => ({
            id: cat._id,
            name: cat.name,
            image: cat.image,
            icon: "basket-outline",
          }));
        } else {
          // Fallback: Dynamic Categories Logic
          const uniqueCategories = [
            ...new Set((productsRes.data.products || []).map((item) => item.category)),
          ];
          categoryList = uniqueCategories.map((cat, index) => ({
            id: index.toString(),
            name: cat || "General",
            image: null,
            icon: "basket-outline",
          }));
        }

        setCategories([
          { id: "all", name: "All", image: null, icon: "view-grid-outline" },
          ...categoryList,
        ]);
      } else {
        setError(productsRes.data.message || "Server error");
      }
    } catch (e) {
      console.error("Axios Error:", e);
      setError("Server se connect nahi ho paya. IP check karein.");
  } finally {
    setLoading(false);
  }
};

const openProduct = (item) => {
  router.push({
    pathname: "/ProductDetail",
    params: { item: JSON.stringify(item) },
  });
};

const filteredProducts =
  activeCategory === "all"
    ? data
    : data.filter(
        (item) =>
          (item.category || "General") ===
          categories.find((c) => c.id === activeCategory)?.name,
      );

const handleRefresh = () => {
  fetchProducts();
};

if (loading) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0aad0a" />
      <Text style={{ marginTop: 10 }}>Connecting to Server...</Text>
    </View>
  );
}

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={handleRefresh}
        >
          <Ionicons name="location-outline" size={24} color="#fff" />
          <Text style={{ color: "#fff", marginLeft: 5, fontSize: 16 }}>
            Refresh
          </Text>
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#7f8c8d"
          />
          <Feather
            name="search"
            size={20}
            color="#7f8c8d"
            style={styles.searchIcon}
          />
        </View>
        <TouchableOpacity
          style={styles.cartIconWrapper}
          onPress={() => router.push("/Cart")}
        >
          <Feather name="shopping-cart" size={24} color="#fff" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cart.length}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Banner Section Re-added */}
        <View style={styles.bannerContainer}>
          <View style={styles.banner}>
            <Text style={styles.bannerTitle}>OPENING SALE:</Text>
            <Text style={styles.bannerSubtitle}>DISCOUNT 50%</Text>
            <TouchableOpacity style={styles.shopNowBtn}>
              <Text style={styles.shopNowText}>SHOP NOW</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories Horizontal */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryItem}
              onPress={() => setActiveCategory(cat.id)}
            >
              <View
                style={[
                  styles.categoryIconCircle,
                  activeCategory === cat.id && styles.activeCategoryCircle,
                ]}
              >
                {cat.image ? (
                  <Image
                    source={{ uri: cat.image }}
                    style={styles.categoryImage}
                    resizeMode="cover"
                  />
                ) : (
                  <MaterialCommunityIcons
                    name={cat.icon}
                    size={28}
                    color="#f39c12"
                  />
                )}
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Products Grid */}
        <View style={styles.bestSellsSection}>
          <Text style={styles.sectionTitle}>
            {activeCategory === "all"
              ? "DAILY BEST SELLS"
              : `${categories.find((c) => c.id === activeCategory)?.name} PRODUCTS`}
          </Text>

          <View style={styles.itemList}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <ProductCard
                  key={item._id}
                  item={item}
                  width={width}
                  wishlist={wishlist}
                  cart={cart}
                  addToWishlist={addToWishlist}
                  removeFromWishlist={removeFromWishlist}
                  addToCart={addToCart}
                  openProduct={openProduct}
                  router={router}
                />
              ))
            ) : (
              <View
                style={{ width: "100%", alignItems: "center", padding: 50 }}
              >
                <Text style={{ color: "#7f8c8d" }}>
                  {error || "No products found in database."}
                </Text>
                {error && (
                  <TouchableOpacity
                    onPress={handleRefresh}
                    style={{
                      marginTop: 10,
                      padding: 10,
                      backgroundColor: "#0aad0a",
                      borderRadius: 5,
                    }}
                  >
                    <Text style={{ color: "white" }}>Retry</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (width) =>
  StyleSheet.create({
    container: { flex: 1, marginTop: 45, backgroundColor: "#fff" },
    header: {
      backgroundColor: "#0aad0a",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: width > 600 ? 30 : 15,
      paddingBottom: 12,
      paddingTop: 12,
    },
    searchContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      borderRadius: 8,
      marginHorizontal: 15,
      paddingHorizontal: 10,
      height: 38,
    },
    searchInput: { flex: 1, fontSize: 14 },
    searchIcon: { marginLeft: 5 },
    cartIconWrapper: { position: "relative" },
    badge: {
      position: "absolute",
      top: -5,
      right: -8,
      backgroundColor: "#fff",
      borderRadius: 10,
      width: 18,
      height: 18,
      justifyContent: "center",
      alignItems: "center",
    },
    badgeText: { color: "#0aad0a", fontSize: 10, fontWeight: "bold" },
    bannerContainer: { padding: width > 600 ? 30 : 15 },
    banner: {
      backgroundColor: "#0984e3",
      borderRadius: 12,
      padding: width > 600 ? 30 : 20,
      height: width > 600 ? 200 : 140,
      justifyContent: "center",
    },
    bannerTitle: {
      color: "#fff",
      fontSize: width > 600 ? 24 : 18,
      fontWeight: "bold",
    },
    bannerSubtitle: {
      color: "#fff",
      fontSize: width > 600 ? 32 : 24,
      fontWeight: "900",
      marginBottom: 10,
    },
    shopNowBtn: {
      backgroundColor: "#0aad0a",
      paddingVertical: width > 600 ? 12 : 8,
      paddingHorizontal: width > 600 ? 25 : 15,
      borderRadius: 6,
      alignSelf: "flex-start",
    },
    shopNowText: {
      color: "#fff",
      fontSize: width > 600 ? 16 : 12,
      fontWeight: "bold",
    },
    categoryScroll: {
      paddingHorizontal: width > 600 ? 30 : 15,
      marginBottom: 20,
    },
    categoryItem: { 
      alignItems: "center", 
      marginRight: 5 ,
      width: width > 600 ? 100 : 80,
    },
    categoryIconCircle: {
      width: width > 600 ? 60 : 50,
      height: width > 600 ? 60 : 50,
      borderRadius: width > 600 ? 40 : 30,
      backgroundColor: "#fef3e2",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 5,
      borderWidth: 2,
      borderColor: "transparent",
    },
    activeCategoryCircle: { borderColor: "#0aad0a" },
    categoryImage: {
      width: "80%",
      height: "80%",
      // borderRadius: width > 600 ? 40 : 30,
    },
    categoryName: {
      fontSize: width > 600 ? 14 : 10,
      color: "#2c3e50",
      fontWeight: "500",
      textAlign: "center",
    },
    bestSellsSection: {
      backgroundColor: "#f0fdf4",
      padding: width > 600 ? 30 : 15,
      paddingBottom: 30,
      minHeight: 400,
    },
    sectionTitle: {
      fontSize: width > 600 ? 24 : 18,
      fontWeight: "bold",
      color: "#2c3e50",
      textAlign: "center",
      marginBottom: 20,
      textTransform: "uppercase",
    },
    itemList: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      gap: 15,
    },
    noProductText: {
      width: "100%",
      textAlign: "center",
      marginTop: 20,
      color: "#7f8c8d",
    },
  });

export default Index;
