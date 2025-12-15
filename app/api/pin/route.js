import cloudinary from "@/libs/cloudinary"
import connectDB from "@/libs/db"
import { NextResponse } from "next/server"
import Pin from "@/models/Pin"
import { Regex } from "lucide-react"

export const POST = async(req)=>{
    connectDB()
    const formData = await req.formData()
    const image = formData.get("image")
    const user = formData.get("user")
    const title = formData.get("title")
    const description = formData.get("description")
    const tags = formData.get("tags")

    const tagsArray = tags.split(",").map((tag)=>tag.trim())
    if(!image){
        return NextResponse.json({error:"No file received"},{status:400})
    }

    try{
        const arrayBuffer = await image.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)
        const uploadedResponse = await new Promise((resolve,reject)=>{
            cloudinary.uploader.upload_stream({},function(error,result){
                if(error){
                    reject(error)
                }
                resolve(result)
            }).end(buffer)
        })

        const pin = await Pin.create({
            user,title,image:{url:uploadedResponse.secure_url},description,tags:tagsArray
        })
        return NextResponse.json({
            success:true,
            message:"Pin posted successfully",
            pin
        },{status:201})
    }catch(err){
        console.error(err)
        return NextResponse.json({error:"Error uploading pin"},{status:500})
    }
}

export const GET = async(req)=>{
    connectDB()
    const search = req.nextUrl.searchParams.get("search")

    let pins;
    if(search){
        const searchRegex = new Regex(search,"i")
        pins = await Pin.find({
            $or:[
                {title:{$regex:searchRegex}},
                {description:{$regex:searchRegex}},
                {tags:{$in:{search}}}
            ]
        })
    }else{
        pins = await Pin.find()
    }
    return NextResponse.json({success:true,pins},{status:200})
}