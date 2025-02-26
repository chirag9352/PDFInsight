"use client"
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"
import { Layout, Shield } from "lucide-react";
import Image from "next/image";
import UploadPdf from "./UploadPdf";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const SideBar = () => {

  const {user} = useUser();
  const path = usePathname();
  const GetUserInfo=useQuery(api.user.GetUserInfo,{
    userEmail:user?.primaryEmailAddress?.emailAddress
  })

  const fileList = useQuery(api.fileStorage.GetUserFiles,{
      userEmail:user?.primaryEmailAddress?.emailAddress
    });

  return (
    <div className="shadow-md h-screen pt-8 px-5 mr-1 flex flex-col bg-gray-300">
      <Image src={'/logo.png'} alt={'logo'} width={170} height={170} className=""/>

      <div className="mt-10 w-4/5 flex justify-center flex-col">


        <UploadPdf fileList={fileList} GetUserInfo={GetUserInfo}/>

      
        <Link href={'/dashboard'}>
        <div className={`w-full flex gap-2 items-center p-3 mt-5 hover:bg-slate-200 rounded-lg cursor-pointer ${path=="/dashboard"&&"bg-slate-200"}`}>
          <Layout />
          <h2>Workspace</h2>
        </div>
        </Link>
        <Link href={'/dashboard/upgrade'}>
        <div className={`w-full flex gap-2 items-center p-3 mt-1 hover:bg-slate-200 rounded-lg cursor-pointer ${path=="/dashboard/upgrade"&&"bg-slate-200"}`}>
          <Shield />
          <h2>Upgrade</h2>
        </div>
        </Link>
      </div>
      {!GetUserInfo?.upgrade && <div className=" absolute bottom-24 w-[80%]">
        <Progress value={(fileList?.length/5)*100}/>
        <p className="text-sm mt-2">{fileList?.length} out of 5 Pdf Uplaoaded</p>
        <p className="text-xs mt-4 text-gray-400">Upgrade to Upload more Pdf</p>
      </div>}
    </div>
  );
};

export default SideBar;
