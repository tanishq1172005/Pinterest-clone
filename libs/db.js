import mongoose from "mongoose";

const connectDB = async()=>{
    try{
        if(mongoose.connection.readyState ===1 ){
            return mongoose.connection
        }
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected")
    }catch(err){
        console.error("Database connection failed:", err)
        throw new Error("Database connection failed")
    }
}

export default connectDB
