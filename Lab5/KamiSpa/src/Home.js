import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllServices } from "./api";
import { useFocusEffect } from "@react-navigation/native";

export default function Home({ navigation, route }) {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("");

    // Load user name khi component mount
    useEffect(() => {
        loadUserName();
    }, []);

    const loadUserName = async () => {
        try {
            const name = await AsyncStorage.getItem("@kami_user_name");
            if (name) {
                setUserName(name);
            }
        } catch (error) {
            console.log("Lỗi đọc user name:", error);
        }
    };

    // Sử dụng useFocusEffect để reload dữ liệu mỗi khi màn hình được focus
    useFocusEffect(
        React.useCallback(() => {
            fetchServices();
        }, [])
    );

    const fetchServices = async () => {
        try {
            setLoading(true);
            const data = await getAllServices();
            setServices(data);
        } catch (error) {
            Alert.alert("Lỗi", "Không thể tải danh sách dịch vụ");
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity

            onPress={() => navigation.navigate("ServiceDetail", { serviceId: item._id })}
        >
            <View style={styles.serviceItem}>
                <Text style={styles.serviceName}>{item.name}</Text>
                <Text style={styles.servicePrice}>{item.price?.toLocaleString()} đ</Text>
            </View>

        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{userName}</Text>
                <Icon name="verified-user" size={24} color="#fff" />
            </View>
            <View style={styles.logo}>
                <Text style={styles.logoTitle}>KAMI SPA</Text>
            </View>
            <View style={styles.service}>
                <Text style={styles.serviceTitle}>Danh sách dịch vụ</Text>
                <TouchableOpacity onPress={() => navigation.navigate("AddService")}>
                    <Icon style={styles.fab} name="add" size={30} color="#fff" />
                </TouchableOpacity>

            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#d63250ff" />
                </View>
            ) : (
                <FlatList
                    data={services}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
    },
    serviceItem: {
        backgroundColor: 'white',
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        borderColor: '#6d6666ff',
        borderWidth: 1,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    servicePrice: {
        fontSize: 16,


    },
    fab: {

        borderRadius: 30,
        backgroundColor: '#d63250ff',

        elevation: 5,

    },
    service: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: 20,
    },
    serviceTitle: {
        color: "black",
        fontSize: 24,
        fontWeight: 'bold',
        padding: 20,
    },
    logoTitle: {
        color: '#d63250ff',
        fontWeight: 'bold',
        fontSize: 50,
        padding: 20,

    },
    logo: {


        justifyContent: 'center',
        alignItems: 'center',
    }
});