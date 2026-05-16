import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons';
import { useRouter } from "expo-router";

function EmptyCart() {
    const router = useRouter();
    return (
        <View style={styles.emptyContainer}>
            <Feather name="shopping-cart" size={80} color="#bdc3c7" style={{ marginBottom: 20 }} />
            <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
            <Text style={styles.emptySubtitle}>Looks like you haven't added anything yet.</Text>
            <TouchableOpacity style={styles.startShoppingBtn} onPress={() => router.push("/(tab)/Index")}>
                <Text style={styles.startShoppingText}>Start Shopping</Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },

    // Empty Cart Styles
    emptyContainer: { flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", padding: 20 },
    emptyTitle: { fontSize: 24, fontWeight: "bold", color: "#2c3e50", marginBottom: 10 },
    emptySubtitle: { fontSize: 16, color: "#7f8c8d", textAlign: "center", marginBottom: 30 },
    startShoppingBtn: { backgroundColor: "#00b82b", paddingVertical: 15, paddingHorizontal: 30, borderRadius: 8 },
    startShoppingText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
})

export default EmptyCart;