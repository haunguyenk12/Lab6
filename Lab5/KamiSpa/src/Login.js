import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "./api";

export default function Login({ navigation }) {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);



    const handleLogin = async () => {
        if (!phone.trim() || !password) {
            Alert.alert("Lỗi", "Vui lòng nhập số điện thoại và mật khẩu");
            return;
        }

        setLoading(true);
        try {
            // Gọi API login từ file api.js
            const data = await login(phone.trim(), password);

            if (!data.token) {
                throw new Error("Server không trả token");
            }

            // Lưu token và user name vào AsyncStorage
            await AsyncStorage.setItem("@kami_token", data.token);
            await AsyncStorage.setItem("@kami_user_name", data.name);

            // Chuyển sang màn hình Main (BottomTabs)
            navigation.replace("Main");
        } catch (err) {
            // Lấy thông báo lỗi từ server nếu có
            const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || err.message;
            Alert.alert("Đăng nhập thất bại", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.title}>Login</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Phone"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                />

                <TouchableOpacity
                    style={[styles.button, loading && { opacity: 0.6 }]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Đăng nhập</Text>}
                </TouchableOpacity>


            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", backgroundColor: "#f2f5f9" },
    box: {
        margin: 20,
        padding: 20,
        justifyContent: "center",
        alignContent: "center",
        borderRadius: 12,


    },
    title: { fontSize: 20, fontWeight: "700", marginBottom: 12, textAlign: "center" },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginTop: 10,
    },
    button: {
        marginTop: 16,
        backgroundColor: "#d63250ff",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: { color: "#fff", fontWeight: "600" },
});
