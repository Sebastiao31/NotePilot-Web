import React from 'react'

const noFolders = () => {
  return (
    <main>
        <div className="flex flex-col items-center gap-4 ">

            <div>
                <img src="/folders/NoFolders.svg" alt="no folders" className="w-20 h-20" />
            </div>

            <div className="flex flex-col items-center gap-2">
                <h1 className="text-xl font-medium text-center">No folders... yet!</h1>
                <p className="text-md text-muted-foreground max-w-lg text-center">Create folder to organize your workspace, organize them by topic, projects or whatever you want them to be.</p>
            </div>
        </div>
    </main>
  )
}

export default noFolders