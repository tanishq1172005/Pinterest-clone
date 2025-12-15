import connectDB from "@/libs/db";
import Pin from "@/models/Pin";
import { NextResponse } from "next/server";

export const GET = async(req,{params})=>{
    try{
        await connectDB()
        const {id} = await params
        const pin = await Pin.findById(id)
        if(!pin){
            return NextResponse.json({success:false,message:"Pin not found"},{status:404})
        }
        return NextResponse.json({success:true,pin},{status:200})
    }catch(err){
        return NextResponse.json({success:false,error:"Error while fetching pin"},{status:500})
    }
}