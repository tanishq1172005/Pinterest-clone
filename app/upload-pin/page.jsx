"use client";

import axios from "axios";
import { ArrowUpFromLine } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";


export default function UploadPin() {
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState("");

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  const { data: session } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault;
    if (!image || !title || !description || !tags) {
      toast.error("Please provide complete details");
    }
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);
    if (session) {
      const user = session?.user?.name;
      formData.append("user", user);
    }

    try {
      setLoading(true);
      await axios.post("/api/pin", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setLoading(false);
      setImage("");
      setImagePreview("");
      setTitle("");
      setDescription("");
      setTags("");
      toast.success("Pin posted");
    } catch (err) {
      toast.error("Error while uploading pin try again");
    }
  };
  return (
    <div className="mx-auto container flex flex-col min-h-screen px-5">
      <h2 className="py-5 text-2xl font-bold sm:text-3xl sm:font-semibold md:text-4xl md:font-normal mb-4">
        Create Pin
      </h2>
      <div className="w-full mx-auto max-w-5xl flex flex-col gap-5 md:flex-row py-7">
        <div className="w-full gap-5 sm:flex-1 flex items-center md:justify-center">
          <div
            className="bg-[#3a3a3a24] hover:cursor-pointer w-full md:w-[340px] flex items-center justify-center relative rounded-[20px] min-h-[450px]"
            onClick={() => document.getElementById("fileInput").click()}
          >
            <input
              type="file"
              id="fileInput"
              onChange={handleImage}
              className="hidden"
            />
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Image Preview"
                className="rounded-[20px] w-full"
                width={300}
                height={300}
              />
            ) : (
              <>
                <div className="flex flex-col items-center gap-5 ">
                  <ArrowUpFromLine className="bg-black w-[38px] h-[38px] p-1.5 text-white rounded-full" />
                  <p>Choose a file or drag and drop it here</p>
                </div>
                <div className="absolute bottom-5 text-center px-5">
                  We recommend using high quality image less than 10mb or .mp4
                  files than 50mb
                </div>
              </>
            )}
          </div>
          <div className="w-full sm:flex-1 flex flex-col justify-center">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2 text-xl">
                <label className="font-bold">Title</label>
                <input
                  type="text"
                  placeholder="Add a title"
                  value={title}
                  onChange={(e)=>setTitle(e.target.value)}
                  className="focus:outline-none p-2 bg-[#3a3a3a24] rounded-[7px]"
                />
              </div>
              <div className="flex flex-col gap-2 text-xl">
                <label className="font-bold">Description</label>
                <textarea rows={3}
                  placeholder="Add a description"
                  value={description}
                  onChange={(e)=>setDescription(e.target.value)}
                  className="focus:outline-none p-2 bg-[#3a3a3a24] rounded-[7px]"
                />
              </div>
              <div className="flex flex-col gap-2 text-xl">
                <label className="font-bold">Tags</label>
                <input
                  type="text"
                  placeholder="anime, marvel, dc"
                  value={tags}
                  onChange={(e)=>setTags(e.target.value)}
                  className="focus:outline-none p-2 bg-[#3a3a3a24] rounded-[7px]"
                />
              </div>
              <button onClick={handleSubmit}
              className="bg-black text-white rounded-lg p-2 text-[24px] my-5 font-bold transition-all duration-300 hover:bg-slate-950">
                {loading?(<ClipLoader color="#fff" size={20}/>):("Upload Pin")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
