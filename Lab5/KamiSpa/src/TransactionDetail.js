import { View, Text, StyleSheet, Alert, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getTransactionById } from "./api";
import { TouchableOpacity } from "react-native";

export default function TransactionDetail({ navigation, route }) {
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const transactionId = route.params?.transactionId;

    useEffect(() => {
        if (transactionId) {
            fetchTransactionDetail();
        }
    }, [transactionId]);

    const fetchTransactionDetail = async () => {
        try {
            setLoading(true);
            const data = await getTransactionById(transactionId);
            setTransaction(data);
        } catch (error) {
            Alert.alert("Lỗi", "Không thể tải chi tiết giao dịch");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price || 0);
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Transaction detail</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#d63250ff" />
                </View>
            </SafeAreaView>
        );
    }

    if (!transaction) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Transaction detail</Text>
                </View>
                <View style={styles.errorContainer}>
                    <Text>Không tìm thấy giao dịch</Text>
                </View>
            </SafeAreaView>
        );
    }

    const customerName = transaction.customer?.name || 'N/A';
    const customerPhone = transaction.customer?.phone || 'N/A';
    const discount = transaction.priceBeforePromotion - transaction.price || 0;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Transaction detail</Text>
                <Icon name="more-vert" size={24} color="#fff" style={styles.moreButton} />
            </View>

            <ScrollView style={styles.scrollView}>
                {/* General Information */}
                <View style={styles.componentContainer}>
                    <Text style={styles.componentTitle}>General information</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Transaction code</Text>
                        <Text style={styles.infoValue}>{transaction.id}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Customer</Text>
                        <Text style={styles.infoValue}>{customerName} - {customerPhone}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Creation time</Text>
                        <Text style={styles.infoValue}>{formatDate(transaction.createdAt)}</Text>
                    </View>
                </View>

                {/* Services list */}
                <View style={styles.componentContainer}>
                    <Text style={styles.componentTitle}>Services list</Text>
                    {transaction.services && transaction.services.map((service, index) => (
                        <View key={index} style={styles.serviceRow}>
                            <View style={styles.serviceInfo}>
                                <Text style={styles.serviceName}>{service.name}</Text>
                                <Text style={styles.serviceQuantity}>x{service.quantity}</Text>
                            </View>
                            <Text style={styles.servicePrice}>{formatPrice(service.price)} đ</Text>
                        </View>
                    ))}
                    <View style={styles.divider} />
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>{formatPrice(transaction.priceBeforePromotion)} đ</Text>
                    </View>
                </View>

                {/* Cost */}
                <View style={styles.componentContainer}>
                    <Text style={styles.componentTitle}>Cost</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Amount of money</Text>
                        <Text style={styles.infoValue}>{formatPrice(transaction.priceBeforePromotion)} đ</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Discount</Text>
                        <Text style={styles.discountValue}>-{formatPrice(discount)} đ</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.totalRow}>
                        <Text style={styles.totalPaymentLabel}>Total payment</Text>
                        <Text style={styles.totalPaymentValue}>{formatPrice(transaction.price)} đ</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: "row",
        justifyContent: "center",
        padding: 16,
        alignItems: "center",
        backgroundColor: "#d63250ff",
    },
    backButton: {
        position: 'absolute',
        left: 10,
    },
    moreButton: {
        position: 'absolute',
        right: 10,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    scrollView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    componentTitle: {
        color: '#d63250ff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    componentContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 12,
        marginHorizontal: 12,
        padding: 16,
        marginTop: 4,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    infoValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
        flex: 1,
        textAlign: 'right',
    },
    serviceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        alignItems: 'flex-start',
    },
    serviceInfo: {
        flexDirection: 'row',
    },
    serviceName: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    serviceQuantity: {
        fontSize: 12,
        color: '#666',
    },
    servicePrice: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 8,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    discountValue: {
        fontSize: 14,
        fontWeight: '500',
    },
    totalPaymentLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    totalPaymentValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#d63250ff',
    },
});


