import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const API_BASE_URL = `${API_URL}/api`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// 🔹 Add Authorization Header Before Every Request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("🔑 Token being sent:", `Bearer ${token.substring(0, 20)}...`);
        } else {
            console.warn("⚠️ No token found in localStorage");
        }
        return config;
    },
    (error) => {
        console.error("🚨 Request interceptor error:", error);
        return Promise.reject(error);
    }
);

// 🔹 Handle API Response & Errors
api.interceptors.response.use(
    (response) => {
        console.log(`✅ API Response [${response.config.method.toUpperCase()}] ${response.config.url}:`, response.status);
        return response;
    },
    (error) => {
        console.error("❌ API Error:", {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });

        if (error.response?.status === 401) {
            console.log("🚫 Unauthorized - Clearing token and redirecting to login");
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// 🔹 Authentication API Endpoints
export const loginUser = async (credentials) => {
    try {
        const response = await api.post("/auth/login", credentials);
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            console.log("✅ Token saved after login:", response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error("❌ Login error:", error);
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await api.post("/auth/register", userData);
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            console.log("✅ Token saved after registration:", response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error("❌ Registration error:", error);
        throw error;
    }
};

// 🔹 Profile API Endpoints
export const getProfile = async () => {
    try {
        const response = await api.get("/profile/me");
        return response.data;
    } catch (error) {
        console.error("❌ Failed to fetch profile:", error);
        throw error;
    }
};

export const updateProfile = async (profileData) => {
    try {
        const response = await api.put("/profile", profileData);
        return response.data;
    } catch (error) {
        console.error("❌ Failed to update profile:", error);
        throw error;
    }
};

// 🔹 Course API Endpoints
export const getCourses = async (params) => {
    try {
        const response = await api.get("/courses", { params });
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching courses:", error);
        throw error;
    }
};

export const getCourseById = async (id) => {
    try {
        const response = await api.get(`/courses/${id}`);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching course:", error);
        throw error;
    }
};

export const enrollInCourse = async (courseId) => {
    try {
        const response = await api.post(`/courses/${courseId}/enroll`);
        return response.data;
    } catch (error) {
        console.error("❌ Error enrolling in course:", error);
        throw error;
    }
};

export default api;
