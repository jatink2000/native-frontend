//===================================
//     Orders - Single/Detail View
//===================================
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image, Linking } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../../constants/api";
import { MaterialIcons } from "@expo/vector-icons";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [userData, setUserData] = useState(null);
    const [shippingAddress, setShippingAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        fetchUserAndOrders();
    }, []);

    const fetchUserAndOrders = async () => {
    try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserData(user);
            
            // Correct API call
            const response = await axios.get(`${API_BASE_URL}/get-user-orders/${user.email}`);
            if (response.data.status) {
                setOrders(response.data.orders);
                if (response.data.orders.length > 0) {
                    setSelectedOrder(response.data.orders[0]);
                    // Address order object se hi le rahe hain
                    setShippingAddress(response.data.orders[0].shippingAddress);
                }
            }
        }
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
};

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric'
        });
    };

    const downloadInvoice = () => {
        Alert.alert("Invoice", "Invoice download feature coming soon!");
    };

    if (loading) return <ActivityIndicator size="large" color="#0aad0a" style={{flex:1}} />;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>My Orders - Single View</Text>

            {/* Order Selection Tabs */}
            {orders.length > 0 && (
                <ScrollView horizontal style={styles.orderTabs}>
                    {orders.map((order, index) => (
                        <TouchableOpacity
                            key={order._id}
                            style={[
                                styles.orderTab,
                                selectedOrder?._id === order._id && styles.orderTabActive
                            ]}
                            onPress={() => setSelectedOrder(order)}
                        >
                            <Text style={[
                                styles.orderTabText,
                                selectedOrder?._id === order._id && styles.orderTabTextActive
                            ]}>
                                Order {index + 1}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            {selectedOrder && (
                <>
                    {/* User ID and Download Invoice */}
                    <View style={styles.section}>
                        <View style={styles.userIdHeader}>
                            <Text style={styles.sectionTitle}>Order #{selectedOrder._id}</Text>
                            <TouchableOpacity style={styles.downloadButton} onPress={downloadInvoice}>
                                <MaterialIcons name="download" size={18} color="#fff" />
                                <Text style={styles.downloadButtonText}>Download Invoice</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* User Details */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>User Details</Text>
                        <View style={styles.detailsCard}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Name:</Text>
                                <Text style={styles.detailValue}>{userData?.name || 'N/A'}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Email:</Text>
                                <Text style={styles.detailValue}>{userData?.email || 'N/A'}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Phone:</Text>
                                <Text style={styles.detailValue}>{userData?.phone || 'N/A'}</Text>
                            </View>
                            <TouchableOpacity style={styles.profileButton}>
                                <MaterialIcons name="person" size={16} color="#fff" />
                                <Text style={styles.profileButtonText}>Go to Profile</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Shipping Address */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Shipping Address</Text>
                        <View style={styles.detailsCard}>
                            {shippingAddress ? (
                                <>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Address:</Text>
                                        <Text style={styles.detailValue}>{shippingAddress.address || 'N/A'}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>City:</Text>
                                        <Text style={styles.detailValue}>{shippingAddress.city || 'N/A'}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>State:</Text>
                                        <Text style={styles.detailValue}>{shippingAddress.state || 'N/A'}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Postal Code:</Text>
                                        <Text style={styles.detailValue}>{shippingAddress.zipCode || 'N/A'}</Text>
                                    </View>
                                </>
                            ) : (
                                <Text style={styles.noData}>No address saved</Text>
                            )}
                        </View>
                    </View>

                    {/* Order Details */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Order Details</Text>
                        <View style={styles.detailsCard}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Order ID:</Text>
                                <Text style={styles.detailValue} numberOfLines={1}>{selectedOrder._id || 'N/A'}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Order Date:</Text>
                                <Text style={styles.detailValue}>{formatDate(selectedOrder.createdAt || selectedOrder.date)}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Order Status:</Text>
                                <Text style={[styles.detailValue, {color: selectedOrder.status === 'Delivered' ? '#0aad0a' : selectedOrder.status === 'Cancelled' ? '#dc3545' : '#f39c12'}]}>
                                    {selectedOrder.status || 'Processing'}
                                </Text>
                            </View>
                            <View style={[styles.detailRow, {borderTopWidth: 1, borderTopColor: '#ddd', paddingTopMargin: 10, marginTop: 10}]}>
                                <Text style={[styles.detailLabel, {fontWeight: 'bold'}]}>Total Amount:</Text>
                                <Text style={[styles.detailValue, {fontWeight: 'bold', color: '#27ae60', fontSize: 16}]}>₹{selectedOrder.totalAmount || '0'}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Products List */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Products</Text>
                        <View style={styles.productsTable}>
                            <View style={styles.productsHeaderRow}>
                                <Text style={[styles.productsHeaderCell, {flex: 0.5}]}>Image</Text>
                                <Text style={[styles.productsHeaderCell, {flex: 1.5}]}>Product</Text>
                                <Text style={[styles.productsHeaderCell, {flex: 0.8}]}>Price</Text>
                                <Text style={[styles.productsHeaderCell, {flex: 0.6}]}>Qty</Text>
                                <Text style={[styles.productsHeaderCell, {flex: 0.8}]}>Total</Text>
                            </View>

                            {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                selectedOrder.items.map((item, index) => (
                                    <View key={index} style={styles.productsRow}>
                                        <View style={[styles.imageCell, {flex: 0.5}]}>
                                            {item.image ? (
                                                <Image 
                                                    source={{ uri: item.image }} 
                                                    style={styles.productImage}
                                                />
                                            ) : (
                                                <View style={styles.noImage}>
                                                    <Text style={styles.noImageText}>-</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={[styles.productsCell, {flex: 1.5}]} numberOfLines={2}>{item.name || 'N/A'}</Text>
                                        <Text style={[styles.productsCell, {flex: 0.8}]}>₹{item.price || '0'}</Text>
                                        <Text style={[styles.productsCell, {flex: 0.6}]}>{item.quantity || '1'}</Text>
                                        <Text style={[styles.productsCell, {flex: 0.8}, {fontWeight: 'bold'}]}>₹{(item.price * item.quantity) || '0'}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.noData}>No items in this order</Text>
                            )}
                        </View>
                    </View>
                </>
            )}

            {orders.length === 0 && !loading && (
                <Text style={styles.noData}>No orders found for your account.</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#34495e',
    },
    orderTabs: {
        marginBottom: 20,
        paddingBottom: 10,
    },
    orderTab: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginRight: 10,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    orderTabActive: {
        backgroundColor: '#0aad0a',
        borderColor: '#0aad0a',
    },
    orderTabText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    orderTabTextActive: {
        color: '#fff',
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#34495e',
        marginBottom: 12,
    },
    userIdHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    downloadButton: {
        flexDirection: 'row',
        backgroundColor: '#27ae60',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    downloadButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 6,
    },
    detailsCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    detailRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#e0e0e0',
    },
    detailLabel: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },
    detailValue: {
        flex: 1.5,
        fontSize: 14,
        color: '#333',
    },
    profileButton: {
        flexDirection: 'row',
        marginTop: 12,
        backgroundColor: '#3498db',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 6,
    },
    productsTable: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    productsHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        alignItems: 'center',
    },
    productsHeaderCell: {
        fontWeight: '700',
        color: '#34495e',
        fontSize: 12,
    },
    productsRow: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ddd',
        alignItems: 'center',
    },
    productsCell: {
        fontSize: 12,
        color: '#333',
    },
    imageCell: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    productImage: {
        width: 40,
        height: 40,
        borderRadius: 5,
        resizeMode: 'cover',
    },
    noImage: {
        width: 40,
        height: 40,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    noImageText: {
        color: '#999',
        fontSize: 14,
    },
    noData: {
        padding: 20,
        textAlign: 'center',
        color: '#999',
        fontSize: 14,
    },
});

export default Orders;
