import { useAction, useMutation } from 'convex/react';
import { Bold, Italic, Underline, Strikethrough, Highlighter, Undo2, Redo2, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Code, Quote, Text, PaintBucket, Eraser, Type, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { chatSession } from '@/app/configs/AiModels';
import { useUser } from '@clerk/nextjs';
import { Loader2Icon } from "lucide-react";

function EditorExtensions({ editor }) {
    const [isLoading,setIsLoading]=useState(false);
    const SearchAi = useAction(api.myAction.search);
    const { fileId } = useParams();
    const saveNotes = useMutation(api.notes.AddNotes);
    const { user } = useUser();


    // fetching data for questions 
    const onAiClick = async () => {
        setIsLoading(true)
        const selectedText = editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to, ' ');
        if(selectedText==""){
            alert("select the question first ")
            setIsLoading(false)
            return
        }

        console.log("Selected Text:", selectedText);

        const result = await SearchAi({ query: selectedText, fileId });
        console.log("Raw Search Result:", result);


        const UnformattedAns = JSON.parse(result);
        let extractedContent = "";
        UnformattedAns?.forEach((item) => {
            extractedContent += item.pageContent + " ";
        });

        extractedContent = extractedContent.trim();
        if (!extractedContent) {
            console.warn("No relevant data found for the query.");
            alert("No data found!")
            return;
        }

        const PROMPT = `
            Answer the following question using the provided content.
            - Do NOT repeat the question.
            - Format the response naturally with clear line breaks.
            - Do NOT include phrases like "Based on the provided content.
            -Listen to the question,and follow the instruction related to size.
            -You can improve the answer also.
            -correct the spelling mistakes in question${selectedText}
            -follow whatever the size is asked for the answer int the question
            -try to give formated answer
            
            **Question:** ${selectedText}
            **Content:** ${extractedContent}

        `;
        try {
            var AiModelResult = await chatSession.sendMessage(PROMPT);
            if(AiModelResult) setIsLoading(false)
            
        } catch (error) {
            if(AiModelResult) setIsLoading(false)
            alert("Api Limit exhausted !")
            return
        }
        
        const rawAnswer = await AiModelResult.response.text();
        
        console.log("Generated Answer:", rawAnswer);

        const cleanedAnswer = rawAnswer
            .replace(/```(\w+)?/g, "") // Remove code block markers (e.g., ```html, ```)
            .replace(/•/g, "\n•") // Ensure bullet points start on a new line
            .replace(/-\s/g, "\n- ") // Ensure dashes start on a new line
            .replace(/\*\s/g, "\n* ")
            .trim();

        const AllText = editor.getHTML();
        editor.commands.setContent(AllText + `<p><strong>Answer:</strong><br>${cleanedAnswer}</p>`);

        saveNotes({
            notes: editor.getHTML(),
            fileId,
            createdBy: user?.primaryEmailAddress?.emailAddress
        });
    };


    return (
        <div className='p-3 border-b flex flex-wrap gap-2 bg-gray-100 shadow-sm'>
            {/* Formatting Options */}
            <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? 'text-blue-600' : ''}><Bold /></button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? 'text-blue-600' : ''}><Italic /></button>
            <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor?.isActive('underline') ? 'text-blue-600' : ''}><Underline /></button>
            <button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor?.isActive('strike') ? 'text-blue-600' : ''}><Strikethrough /></button>

            {/* Text Size */}
            <button onClick={() => editor.chain().focus().increaseFontSize().run()}><ArrowUp /></button>
            <button onClick={() => editor.chain().focus().decreaseFontSize().run()}><ArrowDown /></button>


            {/* Lists */}
            <button onClick={() => editor.chain().focus().toggleBulletList().run()}><List /></button>
            <button onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered /></button>

            {/* Alignment */}
            <button onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeft /></button>
            <button onClick={() => editor.chain().focus().setTextAlign('center').run()}><AlignCenter /></button>
            <button onClick={() => editor.chain().focus().setTextAlign('right').run()}><AlignRight /></button>

            {/* Code & Blockquote */}
            <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code /></button>
            <button onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote /></button>

            {/* Undo & Redo */}
            <button onClick={() => editor.chain().focus().undo().run()}><Undo2 /></button>
            <button onClick={() => editor.chain().focus().redo().run()}><Redo2 /></button>

            {/* Clear Formatting */}
            <button onClick={() => editor.chain().focus().clearContent().run()}><Eraser /></button>

            {/* AI Assistance */}
            <button onClick={() => onAiClick()} className="hover:text-blue-600">{isLoading?<Loader2Icon className='animate-spin' />:<Sparkles />}</button>
        </div>
    );
}

export default EditorExtensions;
