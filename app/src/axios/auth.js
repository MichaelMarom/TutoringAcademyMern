import apiClient from "./config";

export const signup = async (data) => {
    try {
        const result = await apiClient.post('/auth/signup', data);
        return result
    }
    catch (err) {
        console.log(err)
        return err
    }
}

export const login = async (data) => {
    try {
        const result = await apiClient.post('/auth/login', data);
        return result;
    }
    catch (err) {
        console.log(err)
        return err;
    }
}

export const get_user_detail = async (userId) => {
    try {
        const { data } = await apiClient.get(`/user/${userId}`);
        return data;
    }
    catch (err) {
        console.log(err)
        return err;
    }
}

export const get_user_setup_detail = async (role, userId) => {
    try {
        const { data } = await apiClient.get(`/setup/${role}/${userId}`);
        return data;
    }
    catch (err) {
        console.log(err)
        return err;
    }
}

export const forget_password = async (email, password) => {
    try {
        const { data } = await apiClient.put(`/user/forgetpassword/${email}`, { password })
        return data
    }
    catch (err) {
        console.log(err)
        return err
    }
}