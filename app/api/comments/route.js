import connectDB from "@/libs/db";
import Pin from "@/models/Pin";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await connectDB();
    const { user, comment, profileImage, pinId } = await req.json();

    if (!user || !comment || !profileImage || !pinId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const pin = await Pin.findById(pinId);
    if (!pin) {
      return NextResponse.json(
        { success: false, error: "Pin not found" },
        { status: 404 }
      );
    }

    const newComment = {
      user,
      profileImage,
      comment,
      commentedOn: new Date(),
    };

    pin.comments.push(newComment);
    await pin.save();

    return NextResponse.json(
      { success: true, message: "Comment added successfully", pin },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
