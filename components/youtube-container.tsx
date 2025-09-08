import React from 'react'
import { Button } from './ui/button'
import ChooseFolder from './ui/choose-folder'
import YoutubeLinkInput from './ui/youtube-link-input'

const YoutubeContainer = () => {
  return (  
    <main>
        <div className="my-8 gap-6 flex flex-col">
            <div className=" gap-3 flex flex-col">
                <h1 className='text-lg font-medium'>Youtube Link</h1>
                <YoutubeLinkInput/>
            </div>

            <div className=' gap-3 flex flex-col'>
                <h1 className='text-lg font-medium'>Folder</h1>
                <ChooseFolder/>
            </div>
        </div>
        <div className='mb-8'>
            <p className='text-sm text-muted-foreground/60'>* Only public Youtube videos are supported</p>
            <p className='text-sm text-muted-foreground/60'>* Recent uploaded videos can’t be availble for import yet</p>
        </div>
        <div>
                <Button className='rounded-full w-full h-15 text-lg'>
                    Create Note
                </Button>
            </div>
    </main>
  )
}

export default YoutubeContainer