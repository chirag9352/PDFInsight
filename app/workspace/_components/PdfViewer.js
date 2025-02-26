import React from 'react'

function PdfViewer({fileUrl}) {
  return (
    fileUrl? <div className='h-full'>
        <iframe src={fileUrl+"#toolbar=0"} height="90vh" width="100%" className='h-full' />
    </div>: <div className='h-full w-full flex gap-4 p-8 flex-wrap flex-col'>
      {[1,2,3,4,5,6,7,8,9,10].map((element,idx) => {
        return (
          <div key={idx} className='h-24 w-full bg-slate-400 animate-pulse rounded-md'></div>
        )
      })}
    </div>
  )
}

export default PdfViewer