//===================================
//     Reviews
//===================================
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from "axios";
import { API_BASE_URL } from "../../constants/api";

const Reviews = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/reviews`);
            if (res.data?.status) {
                setReviews(res.data.reviews || []);
            } else {
                setReviews([]);
            }
        } catch (error) {
            console.log("Reviews fetch error:", error?.message);
            setReviews([]);
        }
    };

    const handleDelete = async (reviewId) => {
        try {
            const res = await axios.delete(`${API_BASE_URL}/reviews/${reviewId}`);
            if (res.data?.status) {
                setReviews((prev) => prev.filter((r) => r._id !== reviewId));
            }
        } catch (error) {
            console.log("Review delete error:", error?.message);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Reviews</Text>
            <View style={styles.table}>
                <View style={styles.headerRow}>
                    <Text style={[styles.headerCell, { flex: 1.3 }]}>Product name</Text>
                    <Text style={styles.headerCell}>Customer name</Text>
                    <Text style={[styles.headerCell, { flex: 0.8 }]}>Star Rating</Text>
                    <Text style={[styles.headerCell, { flex: 1.6 }]}>Reviews</Text>
                    <Text style={[styles.headerCell, { flex: 0.8 }]}>Actions</Text>
                </View>
                {reviews.map(review => (
                    <View key={review._id} style={styles.row}>
                        <Text style={[styles.cell, { flex: 1.3 }]}>{review?.productId?.title || "—"}</Text>
                        <Text style={styles.cell}>{review.userName || "—"}</Text>
                        <Text style={[styles.cell, { flex: 0.8 }]}>{review.rating}/5</Text>
                        <Text style={[styles.cell, { flex: 1.6 }]} numberOfLines={2}>
                            {review.body || review.title || "—"}
                        </Text>
                        <View style={[styles.actions, { flex: 0.8 }]}>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(review._id)}>
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
    deleteButton: {
        backgroundColor: '#dc3545',
        padding: 8,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
    },
});

export default Reviews;
