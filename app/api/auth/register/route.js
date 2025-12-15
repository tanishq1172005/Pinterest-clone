import cloudinary from "@/libs/cloudinary";
import connectDB from "@/libs/db";
import User from "@/models/User";
import {NextResponse} from "next/server"
import bcrypt from 'bcrypt'

export async function POST(request){
    await connectDB();
    const formData = await request.formData();
    const image = formData.get("image")
    const username = formData.get("username")
    const email = formData.get("email")
    const password = formData.get("password")

    if(!image){
        return NextResponse.json({error:"No file recieved"},{status:400})
    }

    try{
        console.log("Starting registration process...");
        const arrayBuffer = await image.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)
        
        console.log("Uploading to Cloudinary...");
        const uploadedResponse = await new Promise((resolve,reject)=>{
            cloudinary.uploader.upload_stream({},function(error,result){
                if(error){
                    reject(error)
                    return;
                }
                resolve(result)
            }).end(buffer)
        })
        console.log("Cloudinary upload successful:", uploadedResponse.secure_url);

        const hashedPassword = await bcrypt.hash(password,10)
        console.log("Password hashed");

        const user = await User.create({
            username,
            email,
            password:hashedPassword,
            image:uploadedResponse.secure_url
        })
        console.log("User created in DB");
        return NextResponse.json({success:true,
            message:"User Registered"
        },{status:201})
    }catch(error){
        console.error("User registration failed at step:", error)
        return NextResponse.json({error: error.message || "User registration failed"},{status:500})
    }
}
