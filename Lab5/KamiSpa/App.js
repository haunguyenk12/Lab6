import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MenuProvider } from 'react-native-popup-menu';

// Screens
import Login from "./src/Login";
import Home from "./src/Home";
import BottomTabs from "./src/BottomTabs";
import ServiceDetail from "./src/ServiceDetail";
import AddService from "./src/AddService";
import EditService from "./src/EditService";
import AddCustomer from "./src/AddCustomer"
import TransactionDetail from "./src/TransactionDetail";

const Stack = createStackNavigator();

export default function App() {
    const [initialRoute, setInitialRoute] = useState(null); // dùng để xác định route ban đầu

    useEffect(() => {
        // Kiểm tra token trong AsyncStorage
        const checkToken = async () => {
            try {
                const token = await AsyncStorage.getItem("@kami_token");
                if (token) {
                    setInitialRoute("Main"); // đã login → vào danh sách services
                } else {
                    setInitialRoute("Login"); // chưa login → vào Login
                }
            } catch (err) {
                console.log("Lỗi đọc token", err);
                setInitialRoute("Login");
            }
        };
        checkToken();
    }, []);

    // Hiển thị loading trong khi kiểm tra token
    if (!initialRoute) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <MenuProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName={initialRoute}>
                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Main"
                        component={BottomTabs}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Home"
                        component={Home}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="ServiceDetail"
                        component={ServiceDetail}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="AddService"
                        component={AddService}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="EditService"
                        component={EditService}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="AddCustomer"
                        component={AddCustomer}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="TransactionDetail"
                        component={TransactionDetail}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </MenuProvider>
    );
}
