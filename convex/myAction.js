import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { action } from "./_generated/server.js";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";

/ ✅ Load API key from Convex's `.env` file
const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error("Google GenerativeAI API key is missing. Check your convex/.env file.");
}

export const ingest = action({
  args: {
    splitText:v.any(),
    fileId:v.string()
  },
  handler: async (ctx,args) => {
    await ConvexVectorStore.fromTexts(
      args.splitText,
      {fileId:args.fileId},
      new GoogleGenerativeAIEmbeddings({
        apiKey,
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }

    );
    return "Completed.."
  },
});


export const search = action({
  args: {
    query: v.string(),
    fileId:v.string()
  },
  handler: async (ctx, args) => {
    const vectorStore = new ConvexVectorStore(new GoogleGenerativeAIEmbeddings({
      apiKey,
      model: "text-embedding-004", // 768 dimensions
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      title: "Document title",
    }), { ctx });

    const resultOne =await (await vectorStore.similaritySearch(args.query, 1))
    .filter(q=>q.metadata.fileId==args.fileId);
    console.log(resultOne);
    return JSON.stringify(resultOne)
  },
});
