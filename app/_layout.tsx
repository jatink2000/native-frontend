//===================================
//     RootLayout
//===================================
import { Stack } from "expo-router";
import { CartProvider } from "../context/CartContext";
import { WishlistProvider } from "../context/WishlistContext";
import { ProductsDashboardProvider } from "../context/ProductsDashboardContext";
import { CategoriesDashboardProvider } from "../context/CategoriesDashboardContext";

export default function RootLayout() {
  return (
    <CartProvider>
      <WishlistProvider>
        <ProductsDashboardProvider>
          <CategoriesDashboardProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(tab)" />
              <Stack.Screen name="(dashboard)" />
              <Stack.Screen name="(protected)" />
              <Stack.Screen name="Signup" />
              <Stack.Screen name="Resetpassword" />
              <Stack.Screen name="Students" />
              <Stack.Screen name="Style" />
              <Stack.Screen name="Props" />
              <Stack.Screen name="ProductDetail" />
            </Stack>
          </CategoriesDashboardProvider>
        </ProductsDashboardProvider>
      </WishlistProvider>
    </CartProvider>
  );
}