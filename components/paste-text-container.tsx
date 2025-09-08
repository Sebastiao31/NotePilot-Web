import React from 'react'
import { Button } from './ui/button'
import ChooseFolder from './ui/choose-folder'
import PasteTextarea from './ui/paste-textarea'

const PasteTextContainer = () => {
  return (
    <main>
        <div className="my-8 gap-6 flex flex-col">
            <div className=" gap-3 flex flex-col">
                <h1 className='text-lg font-medium'>Paste Text</h1>
                <PasteTextarea/>
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

export default PasteTextContainer