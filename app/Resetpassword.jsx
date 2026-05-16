//===================================
//     Resetpassword
//===================================
import axios from "axios";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { API_BASE_URL } from "../constants/api";

function Resetpassword() {
    let [data, setdata] = useState({ email: "", password: "", cpassword: "" });

    let inputvalue = (name, value) => {
        setdata({ ...data, [name]: value });
    };

    let resetpassword = () => {
        if (!data.email || !data.password) {
            alert("Please fill all details!");
            return;
        }
        if (data.password === data.cpassword) {
            axios.post(`${API_BASE_URL}/resetpassword`, data)
                .then((res) => {
                    alert("Password Reset Successfully!");
                    console.log("Password updated successfully");
                })
                .catch((err) => {
                    console.log(err);
                    alert("Something went wrong!");
                });
        } else {
            alert("Passwords do not match!");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>Enter your email and new password</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} placeholder="Enter Your Email" value={data.email} onChangeText={text => inputvalue('email', text)} keyboardType="email-address" autoCapitalize="none" />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>New Password</Text>
                <TextInput style={styles.input} placeholder="Enter New Password" value={data.password} onChangeText={text => inputvalue('password', text)} secureTextEntry />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput style={styles.input} placeholder="Confirm New Password" value={data.cpassword} onChangeText={text => inputvalue('cpassword', text)} secureTextEntry />
            </View>

            <TouchableOpacity style={styles.btn} onPress={resetpassword}>
                <Text style={styles.btnText}>Reset Password</Text>
            </TouchableOpacity>

            <View style={styles.loginRow}>
                <Link href={"/Login"} asChild>
                    <TouchableOpacity><Text style={styles.link}>Back to Login</Text></TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 20, justifyContent: "center" },
    title: { fontSize: 28, fontWeight: "bold", color: "#2c3e50", marginBottom: 5 },
    subtitle: { fontSize: 16, color: "#7f8c8d", marginBottom: 30 },
    inputContainer: { marginBottom: 15 },
    label: { fontSize: 14, color: "#34495e", marginBottom: 5, fontWeight: "600" },
    input: { borderWidth: 1, borderColor: "#dcdde1", borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: "#f8f9fa", outlineStyle: 'none' },
    btn: { backgroundColor: "#10ac84", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
    btnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    loginRow: { flexDirection: "row", justifyContent: "center", marginTop: 25 },
    link: { color: "#10ac84", fontWeight: "bold", fontSize: 15 }
});

export default Resetpassword;