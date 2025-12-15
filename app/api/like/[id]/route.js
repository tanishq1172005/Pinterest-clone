import connectDB from "@/libs/db";
import Pin from "@/models/Pin";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(request,{params}){
    try{
        await connectDB()
        const token = await getToken({ req: request });
            if (!token) {
              return NextResponse.json(
                { success: false, message: "Unauthorized access" },
                { status: 401 }
              );
            }
            const { id } = await params;
            const pin = await Pin.findById(id);
            if (!pin) {
              return NextResponse.json(
                { success: false, error: "Pin not found" },
                { status: 404 }
              );
            }
            const userLikedIndex = pin.likes.findIndex(like=>like.user === token.name)
            if(userLikedIndex>-1){
                pin.likes.splice(userLikedIndex,1)
                await pin.save()
                return NextResponse.json({success:true,message:"Like removed"},{status:200})
            }else{
                const newLike = {
                    user:token.name
                }
                pin.likes.push(newLike)
                await pin.save()
                return NextResponse.json({success:true,message:"Like added"},{status:201})
            }
    }catch(err){
        return NextResponse.json({success:false,error:"Server error"},{status:500})
    }
}