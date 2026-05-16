//===================================
//     TabLayout
//===================================
import { Tabs, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, Feather } from "@expo/vector-icons";


export default function TabLayout() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const showTabs = !["/Signup", "/Login", "/Resetpassword"].includes(pathname);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        setIsLoggedIn(!!storedUser);
      } catch (error) {
        console.log("Auth check failed:", error);
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, [pathname]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#10ac84", // Freshcart theme color
        tabBarInactiveTintColor: "#7f8c8d",
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
          backgroundColor: "#fff",
          display: showTabs ? "flex" : "none",
        },
        headerShown: false,
      }}
    >
      {/* Make sure 'name' exactly matches your file names inside (tab) folder */}
      <Tabs.Screen
        name="Index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Feather name="home" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="Cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => (
            <Feather name="shopping-cart" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="Wishlist"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color }) => (
            <AntDesign name="heart" color={color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Feather name="user" color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
