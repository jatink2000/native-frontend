//===================================
//     DashboardLayout
//===================================
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Link, Slot, usePathname } from "expo-router";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

const DashboardLayout = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/Dashboard" },
    { name: "Products", href: "/Products" },
    { name: "Category", href: "/Category" },
    { name: "Orders", href: "/AllOrders" },
    { name: "Users", href: "/Users" },
    { name: "Vendors", href: "/Vendors" },
    { name: "Reviews", href: "/Reviews" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>FreshCart</Text>
        </View>
        <View style={styles.menu}>
          {menuItems.map((item) => (
            <Link href={item.href} asChild key={item.name}>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuItemText}>{item.name}</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </View>
      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: 250,
    backgroundColor: "#f8f9fa",
    borderRightWidth: 1,
    borderRightColor: "#dee2e6",
    padding: 20,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  menu: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  activeMenuItem: {
    backgroundColor: "#e9ecef",
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#343a40",
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
});

export default DashboardLayout;
