import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const OrderSuccess = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <MaterialIcons name="check" size={60} color="#fff" />
        </View>
        
        <Text style={styles.congratsText}>Congratulations! 🎉</Text>
        <Text style={styles.subText}>Your order has been placed successfully.</Text>
        
        <TouchableOpacity 
          style={styles.homeBtn} 
          onPress={() => router.replace("/(tab)/Index")} // Index page par wapas
        >
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center' },
  content: { alignItems: 'center', padding: 20 },
  iconCircle: { 
    width: 100, height: 100, borderRadius: 50, 
    backgroundColor: '#0aad0a', justifyContent: 'center', 
    alignItems: 'center', marginBottom: 20 
  },
  congratsText: { fontSize: 26, fontWeight: 'bold', color: '#2c3e50', marginBottom: 10 },
  subText: { fontSize: 16, color: '#7f8c8d', textAlign: 'center', marginBottom: 30 },
  homeBtn: { 
    backgroundColor: '#001e2b', paddingVertical: 15, 
    paddingHorizontal: 40, borderRadius: 10 
  },
  homeBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default OrderSuccess;