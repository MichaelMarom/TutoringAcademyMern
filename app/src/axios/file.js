import { fileUploadClient } from "./config";

export const upload_file = async (formData, userId) => {
    try {
        const { data } = await fileUploadClient.post(`/upload?userId=${userId}`, formData)
        return data
    }
    catch (err) {
        console.log(err);
        return err
    }
}