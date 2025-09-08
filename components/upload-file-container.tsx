import React from 'react'
import DropBrowseFile from './ui/drop-browse-file'
import { Button } from './ui/button'
import ChooseFolder from './ui/choose-folder'

const UploadFileContainer = () => {
  return (
    <main>
        <div className="my-8 gap-6 flex flex-col">
            <div className=" gap-3 flex flex-col">
                <h1 className='text-lg font-medium'>Upload File</h1>
                <DropBrowseFile/>
            </div>

            <div className=' gap-3 flex flex-col'>
                <h1 className='text-lg font-medium'>Folder</h1>
                <ChooseFolder/>
            </div>
        </div>
        <div>
                <Button className='rounded-full w-full h-15 text-lg'>
                    Create Note
                </Button>
            </div>
    </main>
  )
}

export default UploadFileContainer