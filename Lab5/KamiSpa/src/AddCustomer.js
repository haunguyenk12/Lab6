import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, TextInput, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getService, updateService } from "./api";
import { addCustomer } from "./api";
export default function EditService({ navigation }) {

    const [customerName, setCustomerName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);



    const handleAdd = async () => {
        if (!customerName.trim()) {
            Alert.alert("Lỗi", "Vui lòng nhập tên khách hàng");
            return;
        }


        if (!phone) {
            Alert.alert("Lỗi", "Vui lòng nhập sdt");
            return;
        }

        try {
            setUpdating(true);
            setLoading(true);
            await addCustomer(customerName.trim(), phone);
            Alert.alert("Thành công", "Thêm khách hàng thành công", [
                {
                    text: "OK",
                    onPress: () => navigation.goBack()
                }
            ]);
        } catch (error) {
            Alert.alert("Lỗi", "Không thể cập nhật dịch vụ");
        } finally {
            setUpdating(false);
            setLoading(false);
        }
    };



    return (
        <SafeAreaView>
            <View>
                <View style={styles.header}>
                    <Icon style={styles.backButton} name="arrow-back" size={24} color="#fff" onPress={() => navigation.goBack()} />
                    <Text style={styles.headerTitle}>Add Customer</Text>

                </View>
                <View style={styles.updateForm}>
                    <Text>
                        Customer name *
                    </Text>
                    <TextInput style={styles.input} placeholder="Input your customer's name" onChangeText={setCustomerName}></TextInput>
                    <Text>
                        Phone *
                    </Text>
                    <TextInput style={styles.input} value={phone} placeholder="Input phone number" onChangeText={setPhone}></TextInput>
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleAdd}
                    disabled={updating}
                >
                    {updating ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Add</Text>
                    )}
                </TouchableOpacity>
            </View>
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
    serviceDetailItem: {
        fontWeight: 'bold',
    },
    serviceDetailItemInner: {
        fontWeight: 'normal',
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
    }
});    