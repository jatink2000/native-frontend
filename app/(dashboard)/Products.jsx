//===================================
//     Products
//===================================
import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Link, useRouter } from "expo-router";
import { ProductsDashboardContext } from "../../context/ProductsDashboardContext";
import axios from "axios";
import { API_BASE_URL } from "../../constants/api";

const Products = () => {
    const router = useRouter();
    const { products, loading, deleteProduct, fetchProducts } = useContext(ProductsDashboardContext);

   
    const handleEdit = (product) => {
        router.push({
            pathname: '/(dashboard)/EditProduct',
            params: { product: JSON.stringify(product) },
        });
    };

    const handleRefresh = async () => {
        try {
            await fetchProducts();
            Alert.alert('Success', 'Products refreshed successfully');
        } catch (error) {
            console.error('Error refreshing products:', error);
            Alert.alert('Error', 'Failed to refresh products');
        }
    };


    let handleDelete=(data)=>{
        axios.delete(`${API_BASE_URL}/products/${data._id}`).then((res)=>{
            if(res.data.status){
                alert("product deleted successfully")
                window.location.reload()
            }
        })
    }

    return (
        <ScrollView 
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={handleRefresh}
                    colors={['#007bff']}
                />
            }
        >
            <View style={styles.header}>
                <Text style={styles.title}>Products</Text>
                <View style={styles.headerButtons}>
                    <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
                        <Text style={styles.refreshButtonText}>Refresh</Text>
                    </TouchableOpacity>
                    <Link href="/(dashboard)/Addproducts" asChild>
                        <TouchableOpacity style={styles.addButton}>
                            <Text style={styles.addButtonText}>Add Products</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
            <View style={styles.table}>
                <View style={styles.headerRow}>
                    <Text style={[styles.headerCell, { flex: 1 }]}>Image</Text>
                    <Text style={[styles.headerCell, { flex: 2 }]}>Name</Text>
                    <Text style={[styles.headerCell, { flex: 2 }]}>Category</Text>
                    <Text style={[styles.headerCell, { flex: 1 }]}>Price</Text>
                    <Text style={[styles.headerCell, { flex: 1 }]}>Stock</Text>
                    <Text style={[styles.headerCell, { flex: 2, textAlign: 'center' }]}>Actions</Text>
                </View>
                {loading ? (
                    <Text style={{ padding: 10, color: "#64748b" }}>Loading...</Text>
                ) : null}
                {products.map(product => (
                    <View key={product._id} style={styles.row}>
                        <Image source={{ uri: product.image }} style={styles.productImage} />
                        <Text style={[styles.cell, { flex: 2 }]}>{product.title}</Text>
                        <Text style={[styles.cell, { flex: 2 }]}>{product.category}</Text>
                        <Text style={[styles.cell, { flex: 1 }]}>₹{product.salePrice}</Text>
                        <Text style={[styles.cell, { flex: 1 , color: product.stockStatus ? 'green' : 'red' }]}
                            >{product.stockStatus ? 'In Stock' : 'Out of Stock'}</Text>
                        <View style={[styles.actions, { flex: 2, justifyContent: 'center' }]}>
                            <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(product)}>
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDelete(product)}
                            >
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    refreshButton: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    refreshButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
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
        fontSize: 16,
        fontWeight: 500,
    },
    productImage: {
        width: 60,
        height: 60,
        marginRight: 70,
        borderRadius: 5,
    },
    actions: {
        flexDirection: 'row',
    },
    editButton: {
        backgroundColor: '#007bff',
        padding: 8,
        borderRadius: 5,
        marginRight: 10,
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

export default Products;
