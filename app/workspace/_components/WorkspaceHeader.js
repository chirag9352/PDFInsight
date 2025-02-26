import React from 'react'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'

function WorkspaceHeader({fileName}) {
  return (
    <div className='p-4 flex justify-between border-b-2 border-gray-400 shadow-lg bg-gray-300'>
        <Link href={'/dashboard'}>
          <Image src={'/logo.png'} alt={'logo'} width={170} height={170} className=""/>
        </Link>
        {/* <h2 className='font-bold text-2xl'>{fileName}</h2> */}
        <div className='flex items-center gap-4'>
          <Link href={'/dashboard'}><h1 className='border-r-2 border-black pr-4'>Dashboard</h1></Link>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-10 h-10",
              footer: "hidden", // Removes "Secure by Clerk"
              developer: "hidden", // Hides development mode section
            },
          }}
        />
        </div>
    </div>
  )
}

export default WorkspaceHeader