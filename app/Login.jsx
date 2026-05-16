//===================================
//     Login
//===================================
import axios from "axios";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from "../constants/api";

function Login() {
    const router = useRouter();
    let [data, setdata] = useState({ email: "", password: "" })

    useEffect(() => {
        const checkLoggedInUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("user");
                if (storedUser) {
                    router.replace("/Index");
                }
            } catch (e) {
                console.log(e);
            }
        };
        checkLoggedInUser();
    }, [router]);

    let inputvalue = (name, value) => {
        setdata({ ...data, [name]: value })
    }

    let submitbtn = () => {
        axios.post(`${API_BASE_URL}/signin`, data)
        .then(async (res) => {
            if (res.data.status) {
                try {
                    await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
                    router.replace("/Index");
                  } catch (e) {
                    console.log(e);
                  }
            }
            else { alert(res.data.message) }
        }).catch((err) => console.log(err));
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue shopping</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} placeholder="Enter Your Email" value={data.email} onChangeText={text => inputvalue('email', text)} keyboardType="email-address" autoCapitalize="none" />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput style={styles.input} placeholder="Enter Your Password" value={data.password || ''} onChangeText={text => inputvalue('password', text)} secureTextEntry />
            </View>

            <TouchableOpacity style={styles.loginBtn} onPress={submitbtn}>
                <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.linkRow}>
                <Link href={"/Signup"} asChild><TouchableOpacity><Text style={styles.link}>Sign Up</Text></TouchableOpacity></Link>
                <Link href={"/Resetpassword"} asChild><TouchableOpacity><Text style={styles.link}>Forgot Password?</Text></TouchableOpacity></Link>
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
    input: { borderWidth: 1, borderColor: "#dcdde1", borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: "#f8f9fa" },
    loginBtn: { backgroundColor: "#2ecc71", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
    loginText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    linkRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
    link: { color: "#3498db", fontWeight: "600" }
});

export default Login;
