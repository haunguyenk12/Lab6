import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, TextInput, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getAllCustomers } from "./api";
import { FlatList } from "react-native";
import { AddCustomer } from "./src/AddCustomer";

export default function Customer({ navigation }) {

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomers();
    }, []);
    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const data = await getAllCustomers();
            setCustomers(data);
        } catch (error) {
            Alert.alert("Lỗi", "Không thể tải chi tiết dịch vụ");
        } finally {
            setLoading(false);
        }
    };


    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.serviceItem} >
            <View style={styles.customerContainer}>
                <View style={styles.leftInfo}>
                    <Text style={styles.serviceName}>Customer: <Text style={styles.serviceInnerName}>{item.name}</Text></Text>
                    <Text style={styles.serviceName}>Phone: <Text style={styles.serviceInnerName}>{item.phone}</Text></Text>
                    <Text style={styles.serviceName}>Total money: <Text style={styles.serviceInnerPrice}>{item.totalSpent}đ</Text> </Text>
                </View>
                <View style={styles.rightInfo}>
                    <View style={styles.memberIcon}>
                        <Icon name="card-membership" size={30} color="#d63250ff" />
                        <Text style={styles.memberText}>{item.loyalty}</Text>
                    </View>

                </View>
            </View>
        </TouchableOpacity>
    );



    return (
        <SafeAreaView>
            <View>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Customer</Text>

                </View>


                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#d63250ff" />
                    </View>
                ) : (
                    <FlatList
                        data={customers}
                        keyExtractor={(item) => item._id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                    />
                )}
            </View>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate("AddCustomer")}
            >
                <Icon name="plus-one" size={30} color={"#fff"} />
            </TouchableOpacity>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "center",
        padding: 16,
        alignItems: "center",
        backgroundColor: "#d63250ff",

    },
    serviceDetailItemContainer: {
        padding: 10,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 25,
        fontWeight: "bold",
    },


    button: {
        backgroundColor: '#d63250ff',
        borderRadius: 10,
        margin: 15,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    input: {
        borderRadius: 10,
        backgroundColor: '#d7d0d0ff',
        margin: 10,
        padding: 10,
    },
    updateForm: {
        padding: 15,
    },
    backButton: {
        position: 'absolute',
        left: 10,
        top: 23,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    serviceItem: {

        padding: 10,
        margin: 10,
        borderRadius: 8,
        borderWidth: 1,
        position: "relative",
    },
    serviceName: {
        color: '#8f8989ff',
    },
    serviceInnerName: {
        color: '#000000ff',
    },
    leftInfo: {
        flex: "flex-start"
    },
    rightInfo: {
        position: "absolute",
        right: 10,
    },
    customerContainer: {
        flexDirection: "row",
    },
    memberIcon: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        color: "#d63250ff"
    },
    memberText: {
        color: "#d63250ff"
    },
    serviceInnerPrice: {
        color: "#d63250ff"
    },
    addButton: {
        backgroundColor: "#d63250ff",
        borderRadius: 50,
        width: 60,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 85,
        right: 20,
    }
});    