//===================================
//     Signup
//===================================
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { API_BASE_URL } from "../constants/api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { Link, useRouter } from "expo-router"; // Login page pe wapis jane ke liye

function Signup() {
    const router = useRouter();
    let loc = useRoute();
    console.log(loc);

    let [data, setdata] = useState({ email: "", password: "" })

    let inputvalue = (name, value) => {
        setdata({ ...data, [name]: value })
    }

let signupbtn = async () => {
        try {
            const res = await axios.post(`${API_BASE_URL}/signup`, data);
            if (res.data.status) {
                alert("Account Created Successfully!");
                await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
                router.push("/Index");
            } else {
                alert(res.data.message);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to start shopping fresh</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="Enter Your Email" 
                    value={data.email}  
                    onChangeText={text => inputvalue('email', text)} 
                    keyboardType="email-address" 
                    autoCapitalize="none" 
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="Create a Password" 
                    value={data.password || ''} 
                    onChangeText={text => inputvalue('password', text)} 
                    secureTextEntry 
                />
            </View>

            <TouchableOpacity style={styles.signupBtn} onPress={signupbtn}>
                <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>

            {/* Login page par wapis jane ka link */}
            <View style={styles.loginRow}>
                <Text style={styles.grayText}>Already have an account? </Text>
                <Link href={"/Login"} asChild>
                    <TouchableOpacity><Text style={styles.link}>Login Here</Text></TouchableOpacity>
                </Link>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 20, justifyContent: "center" },
    title: { fontSize: 28, fontWeight: "bold", color: "#2c3e50", marginBottom: 5 },
    subtitle: { fontSize: 16, color: "#7f8c8d", marginBottom: 30 },
    inputContainer: { marginBottom: 15 },
    label: { fontSize: 14, color: "#34495e", marginBottom: 5, fontWeight: "600" },
    input: { borderWidth: 1, borderColor: "#dcdde1", borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: "#f8f9fa", outlineStyle: 'none' },
    signupBtn: { backgroundColor: "#10ac84", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
    signupText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    loginRow: { flexDirection: "row", justifyContent: "center", marginTop: 25 },
    grayText: { color: "#7f8c8d", fontSize: 15 },
    link: { color: "#10ac84", fontWeight: "bold", fontSize: 15 }
});

export default Signup;
