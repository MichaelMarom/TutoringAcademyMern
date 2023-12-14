import { apiClient } from "./config";

export const get_chats = async (loggedInUserId, role) => {
    try {
        const { data } = await apiClient.get(`/chats/${role}/${loggedInUserId}`);
        return data
    }
    catch (err) {
        console.log(err)
        return err
    }
}

export const get_chat_message = async (chatId) => {
    try {
        const { data } = await apiClient.get(`/messages/${chatId}`);
        return data
    }
    catch (err) {
        console.log(err)
        return err
    }
}
export const post_message = async (body) => {
    try {
        const { data } = await apiClient.post('/message', body);
        return data
    }
    catch (err) {
        console.log(err)
        return err
    }
}

export const create_chat = async (body) => {
    try {
        const { data } = await apiClient.post('/chat', body);
        return data
    }
    catch (err) {
        console.log(err)
        return err
    }
}

export const set_online_status = async (isOnline, id,role) => {
    try {
        const { data } = await apiClient.post(`/chat/online/${id}/${role}`, { Online: isOnline });
        return data
    }
    catch (err) {
        console.log(err)
        return err
    }
}