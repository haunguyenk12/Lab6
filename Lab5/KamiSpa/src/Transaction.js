import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllTransactions } from "./api";
import { useFocusEffect } from "@react-navigation/native";

export default function Transaction({ navigation }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            fetchTransactions();
        }, [])
    );

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const data = await getAllTransactions();
            setTransactions(data);
        } catch (error) {
            Alert.alert("Lỗi", "Không thể tải danh sách giao dịch");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    const renderItem = ({ item }) => {
        const isCancelled = item.status === 'cancelled';
        const customerName = item.customer?.name || 'Customer';

        return (
            <TouchableOpacity style={styles.transactionItem} onPress={() => navigation.navigate("TransactionDetail", { transactionId: item._id })}>
                <View style={styles.transactionItemLeft}>
                    <View>
                        <Text style={styles.transactionId}>{item.id} - {formatDate(item.createdAt)}{isCancelled && (
                            <Text style={styles.cancelledBadge}> - Cancelled</Text>
                        )}</Text>

                    </View>

                    <View style={styles.servicesContainer}>
                        {item.services && item.services.map((service, index) => (
                            <Text key={index} style={styles.serviceText}>
                                - {service.name}
                            </Text>
                        ))}
                    </View>


                    <View>
                        <Text style={styles.customerText}>Customer: {customerName}</Text>

                    </View>

                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>
                        {formatPrice(item.price)} đ
                    </Text>

                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Transaction</Text>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#ff6b9d" />
                </View>
            ) : (
                <FlatList
                    data={transactions}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#d63250ff',
        padding: 16,
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 12,
    },
    transactionItem: {
        borderWidth: 1,
        borderColor: '#6d6666ff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        flexDirection: 'row',
    },
    cancelledItem: {
        opacity: 0.7,
    },

    transactionId: {
        fontSize: 10,
        fontWeight: '700',
        color: '#333',
    },
    transactionDate: {
        fontSize: 12,
        color: '#666',
    },
    servicesContainer: {
        marginVertical: 8,
        paddingLeft: 4,
    },
    serviceText: {
        fontSize: 13,
        color: '#555',
        marginVertical: 2,
    },

    customerText: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
    },
    priceContainer: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
        color: '#d63250ff',
    },

    cancelledBadge: {
        fontSize: 12,
        color: '#d63250ff',
        fontWeight: 'bold',

    },
    transactionItemLeft: {
        flexDirection: 'flex-start',
    }
});   