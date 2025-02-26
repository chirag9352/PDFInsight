import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const AddFileEntryToDb=mutation(({
    args:{
        fileId:v.string(),
        storageId:v.string(),
        fileName:v.string(),
        fileUrl:v.string(),
        createdBy:v.string()
    },
    handler:async(ctx,args)=>{
        const result = await ctx.db.insert('pdfFiles',{
            fileId:args.fileId,
            fileName:args.fileName,
            fileUrl:args.fileUrl,
            storageId:args.storageId,
            createdBy:args.createdBy
        })

        return "Inserted"
    }
}))

export const getFileUrl=mutation({
    args:{
        storageId:v.string()
    },
    handler:async(ctx,args)=>{
        const url= await ctx.storage.getUrl(args.storageId);
        return url;
    }
})

export const GetFileRecord=query({
    args:{
        fileId:v.string()
    },
    handler:async(ctx,args)=>{
        const result = await ctx.db.query('pdfFiles').filter((q)=>q.eq(q.field('fileId'),args.fileId))
        .collect();

        return result[0];
    }
})

export const GetUserFiles = query({
    args: {
        userEmail:v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        if (!args?.userEmail) {
            return []; // Return an empty array instead of undefined
        }

        const result = await ctx.db
            .query('pdfFiles')
            .filter((q) => q.eq(q.field('createdBy'), args.userEmail))
            .collect();

        return result;
    },
});

export const deletePdf = mutation({
  args: {
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the document IDs to delete
    const pdfFiles = await ctx.db.query('pdfFiles').filter((q) => q.eq(q.field('fileId'), args.fileId)).collect();
    const notes = await ctx.db.query('notes').filter((q) => q.eq(q.field('fileId'), args.fileId)).collect();
    const documents = await ctx.db.query('documents').filter((q) => q.eq(q.field('metadata.fileId'), args.fileId)).collect();

    // Delete from pdfFiles table
    for (const pdf of pdfFiles) {
      await ctx.db.delete(pdf._id);
    }

    // Delete from notes table
    for (const note of notes) {
      await ctx.db.delete(note._id);
    }

    // Delete embedded data
    for (const document of documents) {
      await ctx.db.delete(document._id);
    }

    return "Deleted";
  }
});