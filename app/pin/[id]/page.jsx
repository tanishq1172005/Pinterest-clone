"use client"

import axios from "axios";
import { Heart, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Comment from "@/app/components/Comment";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";


export default function pin(){
    const [comment,setComment] = useState("")
    const [pin,setPin] = useState({})
    const [morePins,setMorePins] = useState([]);
    const [liked,setLiked] =useState(false)

    const { id } = useParams()
    const {data:session} = useSession()

    const fetchMorePin = async()=>{
        const response = await axios.get('/api/pin')
        setMorePins(response.data.pins)
    }

    const fetchPin = async()=>{
        const response = await axios.get(`/api/pin/${id}`)
        setPin(response.data.pin)
        const pinLiked = response.data.pin.likes.some(element =>session?.user?.name === element.user)
        if(pinLiked){
            setLiked(true)
        }else{
            setLiked(false)
        }
    }

    const handlePostComment =async()=>{
        if(session && session.user){
            const profileImage = session?.user?.image;
            const user = session?.user.name;
            if(!comment || !profileImage || !user){
                toast.error("Please add a comment")
                return
            }
            try{
                const res = await axios.post('/api/comments',{
                    user,
                    comment,
                    profileImage,
                    pinId: id 
                })
                if(res.status===201){
                    toast.success(res.data.message)
                    fetchPin()
                    setComment("")
                }
            }catch(err){
                toast.error(err.response?.data?.error || "Something went wrong")
            }
        }
    }

    const handleLike = async()=>{
        const response = await axios.post(`/api/like/${id}`,"",{
            headers:{"Content-Type":"application/json"}
        })
        if(response.status===201){
            toast.success(response.data.message)
            fetchPin()
        }else if(response.status===200){
            toast.success(response.data.message)
            fetchPin()
        }else{
            toast.error("Internal Server Error")
        }
    }

    useEffect(()=>{
        fetchPin();
        fetchMorePin()
    },[id])

    return(
        <>
        {
            pin && pin?.image?.url && morePins?(
                <div className="min-h-screen py-3 md:py-6">
                    <div className="container mx-auto px-4">
                        <div className="lg:flex justify-center">
                            <div className="w-fit mb-6 lg:mb-0 mx-auto lg:mx-0">
                                <Image src={pin?.image?.url} alt="pin" className="rounded-3xl shadow-xl max-h-[600px] object-cover w-auto md:ml-auto"
                                width={500} height={500} loading="eager" priority/>
                            </div>
                            <div className="lg:w-1/3 lg:pl-10 flex flex-col h-full">
                                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 py-2">
                                     <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 group cursor-pointer" onClick={handleLike}>
                                             <Heart className={`${liked? "fill-red-500 text-red-500" :"text-black group-hover:bg-gray-100 rounded-full p-2 transition-all w-10 h-10"}`}/>
                                             <span className="font-semibold text-lg">{pin?.likes?.length || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-lg">{pin?.comments?.length || 0} Comments</span>
                                        </div>
                                     </div>
                                    <div>
                                        <Link href={pin?.image?.url} target="_blank" className="bg-zinc-200 hover:bg-zinc-300 text-black px-6 py-3 rounded-full font-semibold transition-colors">
                                           View Original
                                        </Link>
                                    </div>
                                </div>
                            
                            
                            <div className="flex-1 overflow-y-auto max-h-[500px] pr-2">
                                <h3 className="text-xl font-bold mb-6">Comments</h3>
                                    {
                                        pin?.comments?.length>0?pin?.comments?.map(element=>{
                                            return(
                                                <Comment key={element._id}
                                                user={element.user}
                                                comment={element.comment}
                                                profileImage={element.profileImage}
                                                timestamp={element.commentedOn}
                                                />
                                            )
                                        }):(
                                            <p className="text-gray-500 text-center py-10">No comments yet. Be the first to add one!</p>
                                        )
                                    }
                            </div>
                                    <div className="mt-6 pt-4 border-t sticky bottom-0 bg-white">
                                        <div className="flex items-center gap-3">
                                            {session?.user?.image && (
                                                <Image src={session.user.image} width={40} height={40} className="rounded-full w-10 h-10" alt="user"/>
                                            )}
                                            <div className="relative w-full">
                                                <input type="text" placeholder="Add a comment" className="w-full bg-gray-100 hover:bg-gray-200 focus:bg-white border-none p-4 rounded-3xl pr-12 focus:ring-2 focus:ring-red-500 transition-all outline-none"
                                                value={comment} onChange={e=>setComment(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                                                />
                                                <Send onClick={handlePostComment} className={`absolute right-4 top-4 cursor-pointer transition-colors ${comment.trim() ? 'text-red-500' : 'text-gray-400'}`}/>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                        </div>
                        <h3 className="mt-10 text-2xl font-semibold">More to explore</h3>
                        <div className="flex space-x-4 overflow-x-auto py-4">
                            {morePins && morePins.map(element=>{
                                return(
                                    <Link href={`/pin/${element._id}`} key={element._id}>
                                        <Image width={100} height={100} src={element?.image?.url} alt="pin"
                                        className="w-32 h-32 object-cover rounded-lg shadow-md"/>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
            ):(
                <div className="flex items-center justify-center min-h-[750px]">
                    <ClipLoader color="#ef4444" size={120}/>
                </div>
            )
        }
        </>
    )
    
}