//===================================
//     Index
//===================================
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to FreshCart!</Text>
      <Text style={styles.subtitle}>Your premium grocery delivery app</Text>

      {/* Ye button dabate hi user (tab) folder ke andar wale Index.jsx par chala jayega */}
      <TouchableOpacity 
        style={styles.btn} 
        onPress={() => router.replace("/(tab)/Index")}
      >
        <Text style={styles.btnText}>Let's Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#10ac84", marginBottom: 10, textAlign: "center" },
  subtitle: { fontSize: 16, color: "#7f8c8d", marginBottom: 40, textAlign: "center" },
  btn: { backgroundColor: "#10ac84", paddingVertical: 15, paddingHorizontal: 30, borderRadius: 8, width: "100%", alignItems: "center" },
  btnText: { color: "#fff", fontSize: 18, fontWeight: "bold" }
});