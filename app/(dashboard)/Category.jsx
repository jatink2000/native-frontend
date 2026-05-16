//===================================
//     Category
//===================================
import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, RefreshControl } from 'react-native';
import { Link, useRouter } from "expo-router";
import { CategoriesDashboardContext } from "../../context/CategoriesDashboardContext";
import axios from "axios";
import { API_BASE_URL } from "../../constants/api";

const Category = () => {
    const router = useRouter();
    const { categories, loading, fetchCategories } = useContext(CategoriesDashboardContext);

    const handleEdit = (category) => {
        router.push({
            pathname: '/(dashboard)/EditCategory',
            params: { category: JSON.stringify(category) },
        });
    };
    
    const handleRefresh = async () => {
        try {
            await fetchCategories();
            Alert.alert('Success', 'Categories refreshed successfully');
        } catch (error) {
            console.error('Error refreshing categories:', error);
            Alert.alert('Error', 'Failed to refresh categories');
        }
    };

    const handleDelete = async (data) => {
        try {
            const res = await axios.delete(`${API_BASE_URL}/categories/${data._id}`);
            if (res.data.status) {
                Alert.alert('Success', 'Category deleted successfully');
                await fetchCategories();
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            Alert.alert('Error', 'Failed to delete category');
        }
    };
    
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
                <Text style={styles.title}>Categories</Text>
                <View style={styles.headerButtons}>
                    <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
                        <Text style={styles.refreshButtonText}>Refresh</Text>
                    </TouchableOpacity>
                    <Link href="/(dashboard)/AddCategory" asChild>
                        <TouchableOpacity style={styles.addButton}>
                            <Text style={styles.addButtonText}>Add Category</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
            <View style={styles.table}>
                <View style={styles.headerRow}>
                    <Text style={[styles.headerCell, { flex: 1 }]}>Image</Text>
                    <Text style={[styles.headerCell, { flex: 2 }]}>Name</Text>
                    <Text style={[styles.headerCell, { flex: 1 }]}>Status</Text>
                    <Text style={[styles.headerCell, { flex: 2, textAlign: 'center' }]}>Actions</Text>
                </View>
                {loading ? (
                    <Text style={{ padding: 10, color: "#64748b" }}>Loading...</Text>
                ) : null}
                {categories.map((category) => (
                    <View key={category._id} style={styles.row}>
                        <Image source={{ uri: category.image }} style={styles.categoryImage} />
                        <Text style={[styles.cell, { flex: 2 }]}>{category.name}</Text>
                        <Text style={[styles.cell, { flex: 1 }]}>{category.status}</Text>
                        <View style={[styles.actions, { flex: 2, justifyContent: 'center' }]}>
                            <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(category)}>
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDelete(category)}
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
        fontSize: 14,
    },
    categoryImage: {
        width: 40,
        height: 40,
        marginRight: 150,
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

export default Category;
