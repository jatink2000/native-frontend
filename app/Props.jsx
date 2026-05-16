//===================================
//     Props
//===================================
import { Text, View, StyleSheet } from "react-native";

function Props({ data }) {
    // Fallback data agar galti se parent component se props pass na ho
    const user = data || { name: "Guest User", city: "Unknown City" };

    return (
        <View style={styles.card}>
            <Text style={styles.greeting}>Hello, {user.name}! 👋</Text>
            <Text style={styles.subtitle}>Welcome from {user.city}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { 
        backgroundColor: "#e8f8f5", 
        padding: 20, 
        borderRadius: 12, 
        borderWidth: 1, 
        borderColor: "#10ac84", 
        marginBottom: 15,
        elevation: 2 // Halka sa shadow effect
    },
    greeting: { 
        fontSize: 20, 
        fontWeight: "bold", 
        color: "#2c3e50", 
        marginBottom: 5 
    },
    subtitle: { 
        fontSize: 16, 
        color: "#7f8c8d" 
    }
});

export default Props;