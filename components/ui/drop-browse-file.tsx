import { IconCloudUpload } from '@tabler/icons-react'
import React from 'react'
import { Button } from './button'

const DropBrowseFile = () => {
  return (
    <main>
        <div className='flex flex-col items-center justify-center bg-accent rounded-xl p-4 border border-dashed border-2 gap-3'>
            <div className='mt-4'>
                <IconCloudUpload className='size-12 text-muted-foreground' />
            </div>
            <div className='flex flex-col items-center justify-center gap-1'>
                <h1 className='text-lg font-medium'>
                Choose a file or drag and drop it here 
                </h1>
                <p className='text-sm text-muted-foreground/60'>
                    PDF, DocX, Mp4, Mp3, TXT and more
                </p>
            </div>
            <div className="mt-4">
                <Button className='rounded-full' variant='outline' size='lg'>
                    Browse File
                </Button>
            </div>
        </div>
    </main>
  )
}

export default DropBrowseFile