import api from "@/lib/axios";

export const userService ={
    uploadAvatar:async (form:FormData) => {
        const res  = await api.post("users/uploadAvatar",FormData,{
            headers:{"Content-Type":"multipart/form-data"},
        });

        if(res.status === 400) {
            throw new Error(res.data.message)
        }

        return res.data;
    }
}