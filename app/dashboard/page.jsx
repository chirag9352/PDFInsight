"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import React from "react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";

const Dashboard = () => {
  const { user } = useUser();
  const deletePdf = useMutation(api.fileStorage.deletePdf);

  const fileList = useQuery(api.fileStorage.GetUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  console.log(fileList);

  const handleDelete = async (fileId) => {
    if (window.confirm("Are you sure you want to delete this PDF?")) {
      await deletePdf({ fileId });
    }
  };

  return (
    <div>
      <h2 className="font-medium text-3xl mb-5">Workspace</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 xl:grid-cols-5">
        {fileList?.length >= 0
          ? fileList?.map((file, index) => {
              return (
                <div
                  key={index}
                  className="relative py-5 flex flex-col justify-center items-center gap-3 shadow-md rounded-md border cursor-pointer hover:scale-110 transition-all"
                >
                  <Link href={"/workspace/" + file.fileId}>
                    <Image src={"/pdf.png"} alt="file" width={70} height={70} />
                    <h3 className="mt-4 text-center font-medium text-lg">{file.fileName}</h3>
                  </Link>
                  <button
                    onClick={() => handleDelete(file.fileId)}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
                  >
                    <Trash2 className="text-red-500" size={20} />
                  </button>
                </div>
              );
            })
          : [1, 2, 3, 4, 5, 6, 7].map((item, index) => (
              <div
                key={index}
                className=" bg-slate-200 rounded-md h-[150px] animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
};

export default Dashboard;
