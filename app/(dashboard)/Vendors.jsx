//===================================
//     Vendors
//===================================
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const Vendors = () => {
    const [vendors, setVendors] = useState([]);

    useEffect(() => {
        // Dummy data for vendors
        const dummyVendors = [
            { id: '1', name: 'Vendor One', company: 'Company A', email: 'vendor.one@example.com' },
            { id: '2', name: 'Vendor Two', company: 'Company B', email: 'vendor.two@example.com' },
            { id: '3', name: 'Vendor Three', company: 'Company C', email: 'vendor.three@example.com' },
        ];
        setVendors(dummyVendors);
    }, []);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Vendors</Text>
            <View style={styles.table}>
                <View style={styles.headerRow}>
                    <Text style={styles.headerCell}>Name</Text>
                    <Text style={styles.headerCell}>Company</Text>
                    <Text style={styles.headerCell}>Email</Text>
                    <Text style={styles.headerCell}>Actions</Text>
                </View>
                {vendors.map(vendor => (
                    <View key={vendor.id} style={styles.row}>
                        <Text style={styles.cell}>{vendor.name}</Text>
                        <Text style={styles.cell}>{vendor.company}</Text>
                        <Text style={styles.cell}>{vendor.email}</Text>
                        <View style={styles.actions}>
                            <TouchableOpacity style={styles.editButton}>
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteButton}>
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    table: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        alignItems: 'center',
    },
    cell: {
        flex: 1,
    },
    actions: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    editButton: {
        backgroundColor: '#007bff',
        padding: 8,
        borderRadius: 5,
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        padding: 8,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
    },
});

export default Vendors;
