import axios from "axios";

export const apiClient = axios.create({
    baseURL: "http://localhost:9876", // Adjust the base URL to match your backend API endpoint
    headers: {
        "Content-Type": "application/json",
    },
});

export const fileUploadClient = axios.create({
    baseURL: "http://localhost:9876",
    headers: {
        'Content-Type': 'multipart/form-data',
    },
})

