import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import connectDB from "@/libs/db";
import User from "@/models/User";
import bcrypt from 'bcrypt'


const authOptions ={
    providers:[
        GoogleProvider({
            clientId:process.env.GOOGLE_CLIENT_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET
        }),
        GithubProvider({
            clientId:process.env.GITHUB_CLIENT_ID,
            clientSecret:process.env.GITHUB_CLIENT_SECRET
        }),
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                username:{label:"Username",type:"text",placeholder:"Enter your username"},
                password:{label:"Password",type:"password"}
            },
            async authorize(credentials){
                await connectDB()

                const user = await User.findOne({username: credentials.username});
                if(!user){
                    console.log("User not found")
                    return null
                }

                const isMatch = await bcrypt.compare(credentials.password,user.password)
                if(!isMatch){
                    return null
                }

                return{
                    name:user.username,
                    email:user.email,
                    image:user.image
                }
            }
        })
    ],
    pages:{
        signIn:"/signin"
    }
}

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}

