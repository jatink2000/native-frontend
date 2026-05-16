import React, { useState, useContext } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  useWindowDimensions,
  StatusBar,
  Alert,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { CartContext } from "../../context/CartContext";
import axios from "axios";
import { API_BASE_URL } from "../../constants/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { cart } = useContext(CartContext);
  const { width } = useWindowDimensions();
  const styles = createStyles(width);

  useFocusEffect(
    React.useCallback(() => {
  const getUser = async () => {
        try {
          const storedUser = await AsyncStorage.getItem("user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
            return;
          }
          setUser(null);
        } catch (e) {
          console.log("Error loading user:", e);
        }
      };

      getUser();
    }, []),
  );


  // Logout Logic
  const handleLogout = async () => {
    Alert.alert(
      "logout account",
      "Are you sure? You want to Logout.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${API_BASE_URL}/users/${user.email}`);
              await AsyncStorage.removeItem("user");
              router.replace("/Login");
              Alert.alert("Account logout", "Your has been Logout.");
            } catch (error) {
              console.log("Logout error:", error);
              Alert.alert("Error", "Failed to Logout account.");
            }
          }
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#2c3e50" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#95a5a6" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search settings..."
            placeholderTextColor="#95a5a6"
          />
        </View>
        <TouchableOpacity 
          style={styles.cartBtn} 
          onPress={() => router.push("/Cart")}
        >
          <Feather name="shopping-cart" size={22} color="#fff" />
          {cart.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cart.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {user ? (
          <View style={styles.userCard}>
            <View style={styles.userInfo}>
            <Text style={styles.welcomeTxt}>Namaste,</Text>
            <Text style={styles.userName}>{user.name}</Text></View>
            <View style={styles.avatarCircle}>
              <MaterialCommunityIcons name="account" size={30} color="#fff" />
            </View>
          </View>
        ) : (
          <View style={styles.userCard}>
            <View style={styles.userInfolog}>
            <View style={styles.avatarCircle} marginLeft={30} width={70} height={70} >
              <MaterialCommunityIcons name="account-lock" size={50} color="#ffffff" />
            </View>
            <Text style={styles.welcomeTxt}>Please sign in to view profile</Text>
            <TouchableOpacity style={menuStyles.menuItem} onPress={() => router.push('/Login')}>
              <Feather name="log-in" size={20} color="#3498db" />
              <Text style={menuStyles.menuText}>Sign In</Text>
            </TouchableOpacity>
          </View>
          </View>
        )}

        {user && (
          <View style={styles.menuSection}>
            <MenuLink icon="home" title="Home" onPress={() => router.push("/Index")} />
            <MenuLink icon="shopping-bag" title="My Orders" onPress={() => router.push("components/MyOrders")} />
            <MenuLink icon="settings" title="Account Settings" onPress={() => router.push("components/AccountSetting")} />
            <MenuLink icon="map" title="Address" onPress={() => router.push("components/Address")} />
            
            <TouchableOpacity 
              style={[menuStyles.menuItem, {marginTop: 20}]} 
              onPress={handleLogout} 
            >
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={[styles.menuText, {color: '#e74c3c'}]}>Logout</Text>
                <Feather name="log-out" size={20} color="#e74c3c" style={{marginLeft: 10}} />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// Reusable Menu Component
const MenuLink = ({ icon, title, onPress }) => (
  <TouchableOpacity style={menuStyles.menuItem} onPress={onPress}>
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Feather name={icon} size={20} color="#34495e" />
      <Text style={menuStyles.menuText}>{title}</Text>
    </View>
    <Feather name="chevron-right" size={18} color="#bdc3c7" />
  </TouchableOpacity>
);

const menuStyles = StyleSheet.create({
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuText: {
        fontSize: 16,
        marginLeft: 15,
        color: '#2c3e50',
        fontWeight: '500',
    }
});

function createStyles(width) {
  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: "#f8f9fa",
      marginTop: 45,
    },
    header: {
      backgroundColor: "#2c3e50",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingBottom: 20,
      paddingTop: 40,
    },
    searchBar: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      borderRadius: 25,
      paddingHorizontal: 15,
      height: 40,
      marginRight: 15,
    },
    searchInput: {
      flex: 1,
      marginLeft: 10,
      fontSize: 14,
    },
    cartBtn: {
      padding: 5,
    },
    badge: {
      position: "absolute",
      right: -5,
      top: -5,
      backgroundColor: "#e74c3c",
      borderRadius: 10,
      width: 18,
      height: 18,
      justifyContent: "center",
      alignItems: "center",
    },
    badgeText: {
      color: "#fff",
      fontSize: 10,
      fontWeight: "bold",
    },
    // user card styles
    userCard: {
      backgroundColor: "#fff",
      margin: 20,
      padding: 15,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      elevation: 5, // Android shadow
      shadowColor: "#000", // iOS shadow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
    },
    userInfo: {
      flexDirection: "column",
      alignItems: "flex-end",
      justifyContent: "center",
      marginRight: 20,
    },
    userInfolog: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 20,
    },
    avatarCircle: {
      width: 50,
      height: 50,
      borderRadius: 40,
      backgroundColor: "#3498db",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 20,
    },
    welcomeTxt: {
      fontSize: 16,
      color: "#2c3e50",
    },
    userName: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#2c3e50",
    },
    menuSection: {
      backgroundColor: "#fff",
      marginHorizontal: 20,
      paddingHorizontal: 15,
      borderRadius: 20,
      paddingBottom: 20,
    },
    menuItem: menuStyles.menuItem,
    menuText: menuStyles.menuText
  });
 }

export default Profile;
