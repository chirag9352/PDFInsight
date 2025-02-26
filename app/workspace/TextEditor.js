import React, { useEffect } from 'react'
import { useEditor,EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import EditorExtensions from './_components/EditorExtensions'
import {useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import jsPDF from 'jspdf'
import { Download } from 'lucide-react'

function TextEditor({fileId}) {

    const notes = useQuery(api.notes.GetNotes,{
      fileId:fileId
    })

    // console.log(notes)

    const editor = useEditor({
        extensions: [StarterKit,
          Underline,
          TextAlign.configure({
            types: ['heading', 'paragraph'],
          }),
          Placeholder.configure({
            // Use a placeholder:
            placeholder: 'Write something …',})
        ],
        // content: '',
        editorProps:{
          attributes:{
            class:"focus:outline-none h-screen p-5"
          }
        }
      })


      useEffect(()=>{
        editor&&editor.commands.setContent(notes)
      },[notes&&editor])

  const downloadNotesAsPDF = () => {
    const doc = new jsPDF();
    const content = editor.getText(); // Get plain text content from the editor


    var splitTitle = doc.splitTextToSize(content, 180);
    doc.text(15, 20, splitTitle);

    // doc.text(content, 10, 10);
    doc.save('notes.pdf');
  }

  return (
    <div>
        <div>
            <div className='flex justify-between items-center'>
              <EditorExtensions editor={editor}/>
              <button onClick={downloadNotesAsPDF} className="mr-4 bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2">
              <Download size={16} />
            </button>
          </div>
            
            <div className='overflow-scroll h-[88vh]'>
            <EditorContent editor={editor} />
            </div>
        </div>
    </div>
  )
}

export default TextEditor