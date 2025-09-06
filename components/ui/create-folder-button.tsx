import React from 'react'
import { Button } from './button'
import { IconPlus } from '@tabler/icons-react'
import CreateFolderDialog from '@/components/modals/create-folder'

const CreateFolderButton = () => {
  return (
    <CreateFolderDialog>
      <Button className="rounded-full">
        <IconPlus className="!size-5" />
        <span className="text-lg">Create Folder</span>
      </Button>
    </CreateFolderDialog>
  )
}

export default CreateFolderButton