import React from "react";
import { Icon } from "@iconify/react";
import { redirect } from "next/navigation";
import { useRouter } from 'next/navigation';

interface BlogCard {
  blogID: string;
  blogName: string;
  blogImage: string;
}

export default function BlogCard({
    blogID,
    blogName,
    blogImage,
  }: BlogCard) {

    const handleClickViewDetails = (blogID: string) => {
        console.log("Navigate to",blogID);
    }

    const router = useRouter();


    return (
        <>
            <div className="flex relative w-full h-full flex-col justify-end cursor-pointer overflow-hidden rounded-xl group select-none " onClick={
                (e) => {
                  e.stopPropagation();
                  handleClickViewDetails(blogID)
                  router.push(`/blog/post/${blogID}`)}}
                
            >
                <div 
                className={`flex absolute bg-cover bg-center w-full h-full rounded-xl group-hover:scale-110 transition-all duration-300`} 
                style={{ backgroundImage: `url('${blogImage && blogImage.trim() !== "" ? blogImage : '/images/no-img.png'}')` }} 
                />
                <div className="flex p-2 flex-col w-full h-12 bg-opacity-70 justify-center font-bold bg-black text-white kanit rounded-b-xl items-start z-10">
                    {blogName}
                </div>
            </div>
        </>
    );
}
