import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected database")
    } catch (error) {
        console.log("Connect err:",error)
        process.exit(1)
    }
}