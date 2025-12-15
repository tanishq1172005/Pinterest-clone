import connectDB from "@/libs/db";
import Pin from "@/models/Pin";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    connectDB();
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }
    const { id } = params;
    const pin = await Pin.findById(id);
    if (!pin) {
      return NextResponse.json(
        { success: false, error: "Pin not found" },
        { status: 404 }
      );
    }
    const { user, comment, profileImage } = await request.json();
    const newComment = {
      user,
      comment,
      profileImage,
    };
    pin.comments.push(newComment);
    await pin.save();
    return NextResponse.json(
      { success: true, message: "Comment posted" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 }
    );
  }
}
