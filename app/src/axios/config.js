import axios from "axios";
import { toast } from "react-toastify";


const getAccessToken = () => {
    console.log('called')
    return localStorage.getItem('access_token');
}

export const showErrorToast = (err) => {
    console.log(err)
    if (err?.response?.data?.message.includes('expired')) {
        // signOut(() => navigate.push("/login"))
    }
    toast.error(err?.response?.data?.message || "Error Completing the request")
    return err;
}

export const apiClient = axios.create({
    baseURL: "http://localhost:9876", // Adjust the base URL to match your backend API endpoint
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    config => {
        const accessToken = getAccessToken();
        console.log('inside interceptors')
        config.headers["Authorization"] = `Bearer ${accessToken}`;
        console.log(config, '33')
        return config;
    },
    error => {
        console.log(error, 'in intercepter')
        return Promise.reject(error);
    }
);

export const fileUploadClient = axios.create({
    baseURL: "http://localhost:9876",
    headers: {
        'Content-Type': 'multipart/form-data',
        "Authorization": `Bearer ${getAccessToken()}`
    },
})

