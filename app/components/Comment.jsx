import Image from "next/image";

export default function Comment({user,comment,profileImage}){
    return(
        <div className="flex items-center space-x-3 mb-4">
            <Image width={50} height={50} src={profileImage} alt="profileImage" className="w-8 h-8 rounded-full object-cover"/>
            <div>
                <div className="flex flex-col">
                    <h4 className="font-semibold text-sm">{user}</h4>
                    <p className="text-gray-700 text-sm">{comment}</p>
                </div>
            </div>
        </div>
        
    )
}