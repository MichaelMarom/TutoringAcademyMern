import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:9876", // Adjust the base URL to match your backend API endpoint
    headers: {
        "Content-Type": "application/json",
    },
});

export default apiClient