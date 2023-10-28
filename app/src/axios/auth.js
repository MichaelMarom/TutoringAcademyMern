import axios from "axios";

const AxiosInstance = axios.create({
    baseURL: "http://localhost:9876",
    headers: {
        "Content-Type": "application/json",
    },
});

export const signup = async (data) => {
    try {
        const result = await AxiosInstance.post('/auth/signup', data);
        return result
    }
    catch (err) {
        console.log(err)
        return err
    }
}

export const login = async (data) => {
    try {
        const result = await AxiosInstance.post('/auth/login', data);
        return result;
    }
    catch (err) {
        console.log(err)
        return err;
    }
}

export const get_user_detail = async (userId) => {
    try {
        const {data} = await AxiosInstance.get(`/user/${userId}`);
        return data;
    }
    catch (err) {
        console.log(err)
        return err;
    }
}