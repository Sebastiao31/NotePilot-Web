import React from 'react'
import { Button } from './ui/button'
import ChooseFolder from './ui/choose-folder'
import WebsiteLinkInput from './ui/website-link-input'

const WebsiteContainer = () => {
  return (
    <main>
        <div className="my-8 gap-6 flex flex-col">
            <div className=" gap-3 flex flex-col">
                <h1 className='text-lg font-medium'>Website Link</h1>
                <WebsiteLinkInput/>
            </div>

            <div className=' gap-3 flex flex-col'>
                <h1 className='text-lg font-medium'>Folder</h1>
                <ChooseFolder/>
            </div>
        </div>
        <div className='mb-8'>
            <p className='text-sm text-muted-foreground/60'>* It’ll be imported only the visible text of the website</p>
            <p className='text-sm text-muted-foreground/60'>* Paid articles are not compatible</p>
        </div>
        <div>
                <Button className='rounded-full w-full h-15 text-lg'>
                    Create Note
                </Button>
            </div>
    </main>
  )
}

export default WebsiteContainer