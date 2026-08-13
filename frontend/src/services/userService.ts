import api from "@/lib/axios";

export const userService ={
    uploadAvatar:async (form:FormData) => {
        const res  = await api.post("users/uploadAvatar",form);

        if(res.status === 400) {
            throw new Error(res.data.message)
        }

        return res.data;
    }
}