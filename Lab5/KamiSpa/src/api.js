// src/api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 1. Khởi tạo axios instance
const API_BASE = "https://kami-backend-5rs0.onrender.com";

export const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem("@kami_token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (e) {
            console.log("Lỗi lấy token", e);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 3. Các hàm API dùng cho app
export const login = async (phone, password) => {
    const res = await api.post("/auth", { phone, password });
    return res.data; // server trả về token
};

export const getAllServices = async () => {
    const res = await api.get("/services");
    return res.data;
};

export const getService = async (id) => {
    const res = await api.get(`/services/${id}`);
    return res.data;
};

export const addService = async (name, price) => {
    const res = await api.post("/services", { name, price });
    return res.data;
};

export const updateService = async (id, name, price) => {
    const res = await api.put(`/services/${id}`, { name, price });
    return res.data;
};

export const deleteService = async (id) => {
    const res = await api.delete(`/services/${id}`);
    return res.data;
};
export const getAllCustomers = async () => {



    const res = await api.get("/customers");
    return res.data;
};

export const addCustomer = async (name, phone, token) => {

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const res = await api.post("/customers", { name, phone }, config);
    return res.data;
};

export const getAllTransactions = async () => {
    const res = await api.get("/transactions");
    return res.data;
};

export const getTransactionById = async (id) => {
    const res = await api.get(`/transactions/${id}`);
    return res.data;
};