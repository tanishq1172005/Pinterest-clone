"use client";

import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import Image from "next/image";

export default function signup() {
  const {data:session} = useSession()
  const router = useRouter()
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading,setLoading] = useState(false)

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

  const handleRegister=async()=>{
    setLoading(true)
    if(!username || !email){
        toast.error("Please provide complete details");
        setLoading(false)
        return;
    }
    try{
        const formdata = new FormData()
        formdata.append("username",username)
        formdata.append("email",email)
        formdata.append("password",password)
        formdata.append("image",image)
        await axios.post('/api/auth/register',formdata,{
            headers:{"Content-Type":"multipart/form-data"}
        })
        setUsername("")
        setEmail("")
        setPassword("")
        setImage("")
        setLoading(false)
        router.push('/signin')
    }catch(err){
        console.error("Registration failed:", err)
        console.log("Error Response Data:", err.response?.data)
        const errorMessage = err.response?.data?.error || "Registration failed try again";
        toast.error(errorMessage)
        setLoading(false)
    }
  }

  return (
    <>
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
            Welcome to Pinterest
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
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
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
            <Image
              src={imagePreview ? imagePreview : "/avatar.png"}
              alt="User avatar"
              width={100}
              height={100}
              className="w-12 h-12 rounded-full"
            />
            <label
              className={`${
                imagePreview ? "bg-green-600" : "bg-gray-600"
              } w-[webkit-fill-available] text-white px-4 py-2 rounded cursor-pointer`}
            >
              Choose Avatar
              <input type="file" className="hidden" onChange={handleImage} />
            </label>
          </div>
              <button onClick={handleRegister} className="w-full p-3 bg-red-500 cursor-pointer text-white rounded-lg mb-4 hover:bg-red-600 transition-all duration-300">
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
          <p className="text-center text-sm mt-4">Already have an account? <Link href="/signin" className="text-blue-600 hover:underline">Sign In</Link></p>
        </div>
      </div>
    </>
  );
}
