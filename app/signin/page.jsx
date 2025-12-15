"use client"

import { signIn, useSession } from "next-auth/react"
import { useState,useEffect } from "react"
import { ClipLoader } from "react-spinners"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import Image from "next/image"

export default function signin(){
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [loading,setLoading] = useState(false)
    const [imagePreview,setImagePreview] = useState("")
    const {data:session} = useSession()
    const router = useRouter()
    useEffect(()=>{
        if(session){
            router.push("/")
        }
      },[session,router])

      const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage(file);
      setImagePreview(reader.result);
    };
  };

      const handleLogin=async()=>{
        setLoading(true)
        if(!username || !password){
            toast.error("Please provide your credentials")
            setLoading(false)
            return;
        }
        const res= await signIn("credentials",{
            redirect:false,
            username,
            password
        });
        setLoading(false)
        if(res?.error){
            setLoading(false)
            toast.error("Invalid credentials")
        }
      }
      return(
        <div className="min-h-screen flex justify-center items-center bg-gray-100 fixed top-0 left-0 w-full">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
          <div className="flex justify-center mb-4">
            <Image
              src="/pinterest.webp"
              alt="Pinterest"
              height={150}
              width={150}
              priority
              className="w-12 h-12"
            />
          </div>
          <h2 className="text-center text-xl font-semibold mb-1">
            Log in to see more
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Find new ideas to try
          </p>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <div className="w-full p-3 rounded-lg focus:outline-none flex items-center space-x-4">
            
      
          </div>
              <button onClick={handleLogin} className="w-full p-3 bg-red-500 cursor-pointer text-white rounded-lg mb-4 hover:bg-red-600 transition-all duration-300">
                {loading? <ClipLoader color={"#fff"} size={20}/>:"Continue"}
              </button>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-px bg-gray-300 w-full"></div>
            <p className="text-gray-500">OR</p>
            <div className="h-px bg-gray-300 w-full"></div>
          </div>
          <button
            onClick={() =>
              signIn("github", {
                callbackUrl: "/",
              })
            }
            className="w-full p-3 bg-black text-white rounded-lg flex justify-center items-center space-x-2 mb-3 hover:bg-[#0111] hover:text-black cursor-pointer"
          >
            <Image
              src="/github2.png"
              alt="Github"
              width={150}
              height={150}
              priority
              className="w-6 h-6"
            />
            <span className="font-semibold">Continue with Github</span>
          </button>
          <button
            onClick={() =>
              signIn("google", {
                callbackUrl: "/",
              })
            }
            className="w-full p-3 bg-white text-black rounded-lg flex justify-center items-center space-x-2 mb-3 hover:bg-[#0111] cursor-pointer"
          >
            <span className="font-semibold">Continue with Google</span>
            <Image
              src="/google.jpg"
              alt="Google"
              width={150}
              height={150}
              priority
              className="w-6 h-6"
            />
          </button>
          <p className="text-xs text-center text-gray-500">By continuing you agree to Pinterest's Terms of Services</p>
          <p className="text-center text-sm mt-4">Don't have an account? <Link href="/signup" className="text-blue-600 hover:underline">Sign Up</Link></p>
        </div>
      </div>
      )
}