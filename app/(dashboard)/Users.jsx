//===================================
//     Users
//===================================
import React, {  useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../../constants/api';
import { useRouter } from 'expo-router';    

const Users = () => {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    useEffect(() => {
        axios.get(`${API_BASE_URL}/users`).then((res)=>{
            if(res.data.status){
                setUsers(res.data.users || []);
            }
        })
    }, []);

    const handleEdit = (user) => {
        router.push({
            pathname: '/(dashboard)/EditUsers',
            params: { user: JSON.stringify(user) }
        });
    };
    
    let handleDelete=(data)=>{
        axios.delete(`${API_BASE_URL}/users/${data._id}`).then((res)=>{
            if(res.data.status){
                Alert.alert("User deleted successfully")
                setUsers(users.filter(user => user._id !== data._id));
            }
        })
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Users</Text>
            <View style={styles.table}>
                <View style={styles.headerRow}>
                    <Text style={styles.headerCell}>Name</Text>
                    <Text style={styles.headerCell}>Email</Text>
                    <Text style={styles.headerCell}>Phone</Text>
                    <Text style={styles.headerCell}>Actions</Text>
                </View>
                {users.map(user => (
                    <View key={user._id} style={styles.row}>
                        <Text style={styles.cell}>{user.name}</Text>
                        <Text style={styles.cell}>{user.email}</Text>
                        <Text style={styles.cell}>{user.phone}</Text>
                        <View style={styles.actions}>
                            <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(user)}>
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(user)}>
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

export default Users;
