"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import uuid4 from "uuid4";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

const UploadPdf = ({ GetUserInfo,fileList}) => {

  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl)
  const addFileEntry=useMutation(api.fileStorage.AddFileEntryToDb);
  const getFileUrl = useMutation(api.fileStorage.getFileUrl);
  const embeddDocument = useAction(api.myAction.ingest)
  const {user}=useUser();
  const [file,setFile]=useState();
  const [fileName,setFileName]=useState();
  const [loading,setLoading]=useState(false);
  const [open,setOpen]=useState(false);

  const OnFileSelect=(event)=>{
    setFile(event.target.files[0])
  }

  const OnUpload=async()=>{
    setLoading(true)

    try {
    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();
    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file?.type },
      body: file,
    });
    const { storageId } = await result.json();
    const fileId = uuid4()
    const fileUrl = await getFileUrl({storageId:storageId})

    // Step 3: Save the newly allocated storage id to the database
    const resp=await addFileEntry({
      fileId:fileId,
      storageId,storageId,
      fileName:fileName??"Untitled File",
      fileUrl:fileUrl,
      createdBy:user?.primaryEmailAddress?.emailAddress
    })
    // console.log(resp)

    //Api call to fetch PDF Process Data
    
      const ApiResp = await axios.get(`/api/pdf-loader?pdfUrl=${fileUrl}`)
      // console.log(ApiResp.data.result)
      await embeddDocument({
        splitText:ApiResp.data.result,
        fileId:fileId
      });
      
    } catch (error) {
      alert("Please Check your Internet Connection!")
    }

    setLoading(false)
    setOpen(false)
  } 

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button disabled={(fileList?.length>=5 && !GetUserInfo?.upgrade)?true:false} onClick={()=>setOpen(true)}>+ Upload Pdf File</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload PDF File</DialogTitle>
          <DialogDescription>
          Select a file to Upload
          </DialogDescription>
            <div className="mt-10">
              <h1 className="mt-5">Select a file to Upload</h1>
              <div className="mt-1 p-3 rounded-md border">
                <input type="file" accept="application/pdf"
                  onChange={(event)=>OnFileSelect(event)}
                />
              </div>
              <div className="mt-2">
                <label>File Name *</label>
                <Input placeholder="File Name" onChange={(e)=>setFileName(e.target.value)}></Input>
              </div>
            </div>
        </DialogHeader> 
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button onClick={OnUpload} disabled={loading || !file || !fileName}>
            {
              loading?<Loader2Icon className="animate-spin"/>:"Upload"
            }
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadPdf;
