import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// const pdfUrl="https://grand-frog-552.convex.cloud/api/storage/85422eb3-d6d0-4323-a0cd-04c7f01031d1"

export async function GET(req){

    const reqUrl = req.url;
    const {searchParams} = new URL(reqUrl);
    const pdfUrl = searchParams.get("pdfUrl")

    //1. Load the pdf file
    const response  = await fetch(pdfUrl);
    const data =await response.blob();
    const loader = new WebPDFLoader(data);
    const docs = await loader.load()


    let pdfTextContent="";
    docs.forEach(doc=>{
        pdfTextContent=pdfTextContent+doc.pageContent;
    })

    //2.split the text into small chunks
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
    const output = await splitter.createDocuments([pdfTextContent]);

    let splitterList=[];
    output.forEach(doc=>{
        splitterList.push(doc.pageContent) 
    })

    return NextResponse.json({result:splitterList})
}