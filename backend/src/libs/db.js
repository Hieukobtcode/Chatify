import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // Tối ưu connection pool
            maxPoolSize: 10,
            minPoolSize: 2,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            // Giảm heartbeat frequency để tiết kiệm tài nguyên
            heartbeatFrequencyMS: 10000,
        })
        console.log("Connected database")
    } catch (error) {
        console.log("Connect err:",error)
        process.exit(1)
    }
}