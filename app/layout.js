"use client"
import { Geist, Geist_Mono } from "next/font/google";
import {SessionProvider} from 'next-auth/react'
import { ToastContainer } from 'react-toastify';
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <Navbar/>
          {children}
          <ToastContainer theme="colored" position="bottom-right"/>
        </SessionProvider>
        
      </body>
    </html>
  );
}
