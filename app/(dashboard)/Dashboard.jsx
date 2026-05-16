//===================================
//     Dashboard
//===================================
import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { ProductsDashboardContext } from "../../context/ProductsDashboardContext";
import { CategoriesDashboardContext } from "../../context/CategoriesDashboardContext";
import { CartContext } from "../../context/CartContext";
import axios from "axios";
import { API_BASE_URL } from "../../constants/api";

const Dashboard = () => {
  const router = useRouter();
  const { products } = useContext(ProductsDashboardContext);
  const { categories } = useContext(CategoriesDashboardContext);
  const { cart } = useContext(CartContext);
  const [users, setUsers] = useState([]);
  const [ordersDropdownVisible, setOrdersDropdownVisible] = useState(false);
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/users`)
      .then((res) => {
        if (res.data.status) {
          setUsers(res.data.users || []);
        }
      })
      .catch((error) => {
        console.log("Users fetch error:", error?.message);
        setUsers([]);
      });
  }, []);
  const summaryData = [
    {
      title: "Total Products",
      value: products.length,
      icon: <FontAwesome name="shopping-basket" size={30} color="#fff" />,
      color: "#1abc9c",
    },
    {
      title: "Total Categories",
      value: categories.length,
      icon: <MaterialIcons name="category" size={30} color="#fff" />,
      color: "#3498db",
    },
    {
      title: "Total Orders",
      value: cart.length,
      icon: <FontAwesome name="shopping-cart" size={30} color="#fff" />,
      color: "#9b59b6",
    },
    {
      title: "Total Customers",
      value: users.length,
      icon: <FontAwesome name="users" size={30} color="#fff" />,
      color: "#e67e22",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.summaryContainer}>
        {summaryData.map((item, index) => (
          <View
            key={index}
            style={[styles.summaryCard, { backgroundColor: item.color }]}
          >
            <View style={styles.cardIcon}>{item.icon}</View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardValue}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.quickLinksContainer}>
        <Text style={styles.quickLinksTitle}>Quick Links</Text>
        <View style={styles.links}>
          <Link href="/Products" asChild>
            <TouchableOpacity style={styles.link}>
              <Text style={styles.linkText}>View Products</Text>
            </TouchableOpacity>
          </Link>
          
          {/* Orders Dropdown */}
          <TouchableOpacity 
            style={styles.link}
            onPress={() => setOrdersDropdownVisible(true)}
          >
            <Text style={styles.linkText}>Manage Orders</Text>
            <MaterialIcons name="arrow-drop-down" size={20} color="#34495e" style={{marginLeft: 5}} />
          </TouchableOpacity>

          {/* Orders Dropdown Modal */}
          <Modal
            visible={ordersDropdownVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setOrdersDropdownVisible(false)}
          >
            <TouchableOpacity 
              style={styles.dropdownOverlay}
              activeOpacity={1}
              onPress={() => setOrdersDropdownVisible(false)}
            >
              <View style={styles.dropdownMenu}>
                <TouchableOpacity
                  style={styles.dropdownOption}
                  onPress={() => {
                    setOrdersDropdownVisible(false);
                    router.push("/Orders");
                  }}
                >
                  <MaterialIcons name="list" size={20} color="#34495e" />
                  <Text style={styles.dropdownOptionText}>View Orders</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>

          <Link href="/Users" asChild>
            <TouchableOpacity style={styles.link}>
              <Text style={styles.linkText}>View Users</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#34495e",
  },
  summaryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  summaryCard: {
    width: "48%",
    borderRadius: 10,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardIcon: {
    marginRight: 15,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  cardValue: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  quickLinksContainer: {
    marginBottom: 30,
  },
  quickLinksTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#34495e",
  },
  links: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  link: {
    backgroundColor: "#f2f2f2",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  linkText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#34495e",
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownMenu: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    minWidth: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: "#34495e",
    marginLeft: 10,
    fontWeight: "500",
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: "#ddd",
  },
});

export default Dashboard;
