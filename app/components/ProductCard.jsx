import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { AntDesign } from "@expo/vector-icons";

const ProductCard = ({
  item,
  width,
  wishlist,
  cart,
  addToWishlist,
  removeFromWishlist,
  addToCart,
  openProduct,
  router,
}) => {
  // Discount logic shifted here
  let discount = 0;
  if (item.regularPrice && item.salePrice) {
    discount = Math.round(
      ((item.regularPrice - item.salePrice) / item.regularPrice) * 100
    );
  }

  const isInWishlist = wishlist.find((w) => w._id === item._id);
  const isInCart = cart.find((c) => c._id === item._id);

  return (
    <TouchableOpacity
      style={[
        styles.productCard,
        { width: width > 900 ? "18%" : width > 600 ? "30%" : "47%" },
      ]}
      onPress={() => openProduct(item)}
    >
      {/* Top Badges */}
      <View style={styles.badgeContainer}>
        <TouchableOpacity
          style={styles.wishlistIcon}
          onPress={(e) => {
            e.stopPropagation();
            isInWishlist ? removeFromWishlist(item) : addToWishlist(item);
          }}
        >
          <AntDesign
            name="heart"
            size={20}
            color={isInWishlist ? "#ff0000" : "#000"}
          />
        </TouchableOpacity>
        {discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>GET UPTO</Text>
            <Text style={styles.discountTextBold}>{discount}% OFF</Text>
          </View>
        )}
      </View>

      {/* Product Image */}
      <Image
        source={{
          uri: item.image || item.thumbnail || "https://via.placeholder.com/150",
        }}
        style={styles.productImage}
        contentFit="contain"
      />

      {/* Details */}
      <Text style={styles.productTitle} numberOfLines={2}>
        {item.title}
      </Text>

      <View style={styles.ratingRow}>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((_, i) => (
            <AntDesign
              key={i}
              name="star"
              size={12}
              color={i < (item.rating || 4) ? "#f39c12" : "#e0e0e0"}
            />
          ))}
        </View>
        <Text style={styles.reviewCount}>(19)</Text>
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.price}>₹{item.salePrice || item.price}</Text>
        {item.regularPrice && (
          <Text style={styles.oldPrice}>₹{item.regularPrice}</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={(e) => {
          e.stopPropagation();
          isInCart ? router.push("/Cart") : addToCart(item);
        }}
      >
        <Text style={styles.addButtonText}>
          {isInCart ? "GO TO CART" : "ADD TO CART"}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    position: "relative",
  },
  badgeContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1,
  },
  wishlistIcon: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    padding: 5,
  },
  discountBadge: {
    backgroundColor: "#0984e3",
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
    alignItems: "center",
  },
  discountText: { color: "#fff", fontSize: 8 },
  discountTextBold: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  productImage: {
    width: "100%",
    height: 120,
    marginBottom: 10,
    marginTop: 40,
  },
  productTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 5,
    height: 35,
  },
  ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  stars: { flexDirection: "row" },
  reviewCount: { fontSize: 10, color: "#7f8c8d", marginLeft: 4 },
  priceRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0aad0a",
    marginRight: 6,
  },
  oldPrice: {
    fontSize: 12,
    color: "#95a5a6",
    textDecorationLine: "line-through",
  },
  addButton: {
    borderWidth: 1,
    borderColor: "#0aad0a",
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: "center",
  },
  addButtonText: { color: "#0aad0a", fontWeight: "bold", fontSize: 12 },
});

export default ProductCard;