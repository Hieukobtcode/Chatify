import multer from "multer"
import { v2 as cloudinary } from 'cloudinary';

export const upload = multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:1024 * 1024 * 50, //1MB
    },
})

export const uploadImageFromBuffer = (buffer,options) => {
    return new Promise((resolve,reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            folder: "chatify_chat/avatars",
            resource_type:"image",
            transformation: [{width:200,height:200,crop:"fill"}],
            ...options,
        },(error,result) => {
            if(error){
                reject(error);
            }else{
                resolve(result);
            }
        })
        uploadStream.end(buffer);
    })
};

export const uploadImageMessageFromBuffer = (buffer,options) => {
    return new Promise((resolve,reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            folder: "chatify_chat/messages",
            resource_type:"image",
            ...options,
        },(error,result) => {
            if(error){
                reject(error);
            }else{
                resolve(result);
            }
        })
        uploadStream.end(buffer);
    })
};

export const uploadFileMessageFromBuffer = (buffer, options) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            folder: "chatify_chat/files",
            resource_type: "auto",
            ...options,
        }, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
        uploadStream.end(buffer);
    });
};
