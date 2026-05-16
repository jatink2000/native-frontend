//===================================
//     Students
//===================================
import { View, Text, StyleSheet, ScrollView } from "react-native";

function Students() {
    let allstudents = [
        { name: "Ravi", course: "Web Dev", email: "ravi@gmail.com" },
        { name: "Aman", course: "App Dev", email: "aman@gmail.com" },
        { name: "Karan", course: "UI/UX", email: "karan@gmail.com" },
        // ... tumhare baki dummy data
    ];

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.headerTitle}>Student Records</Text>
            
            {/* Table Header */}
            <View style={styles.tableHeader}>
                <Text style={[styles.headerText, { flex: 1 }]}>Name</Text>
                <Text style={[styles.headerText, { flex: 1 }]}>Course</Text>
                <Text style={[styles.headerText, { flex: 2 }]}>Email</Text>
            </View>

            {/* Table Rows */}
            {allstudents.map((data, index) => (
                <View key={index} style={styles.tableRow}>
                    <Text style={[styles.cellText, { flex: 1, fontWeight: "bold" }]}>{data.name}</Text>
                    <Text style={[styles.cellText, { flex: 1, color: "#10ac84" }]}>{data.course}</Text>
                    <Text style={[styles.cellText, { flex: 2, color: "#7f8c8d" }]}>{data.email}</Text>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f9fa", padding: 15 },
    headerTitle: { fontSize: 22, fontWeight: "bold", color: "#2c3e50", marginBottom: 15, marginTop: 10 },
    tableHeader: { flexDirection: "row", backgroundColor: "#2c3e50", padding: 12, borderTopLeftRadius: 8, borderTopRightRadius: 8 },
    headerText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
    tableRow: { flexDirection: "row", backgroundColor: "#fff", padding: 12, borderBottomWidth: 1, borderBottomColor: "#ecf0f1" },
    cellText: { fontSize: 14, color: "#2c3e50" }
});

export default Students;