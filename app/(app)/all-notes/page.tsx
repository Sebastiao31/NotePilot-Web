"use client"

// Header is provided by the `(app)` group layout

import { Button } from "@/components/ui/button";
import { IconCheckbox } from "@tabler/icons-react";
import NoFolders from "@/components/no-folders";
import FoldersList from "@/components/folders-list";
import CreateFolderButton from "@/components/ui/create-folder-button";
import { useFolders } from "@/hooks/use-folders";

export default function Page() {
  const { folders, loading } = useFolders()
  return (
    <main>
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-semibold">Folders</h1>
        </div>

        <div className="flex gap-4">
          <Button variant="outline">
            <IconCheckbox className="!size-5" />
            <span className="text-lg">Select</span>
          </Button>
          <CreateFolderButton />
        </div>
      </div>

      <div className="mt-12">
        {loading ? null : folders.length > 0 ? (
          <FoldersList />
        ) : (
          <div className="flex items-center justify-center">
            <NoFolders />
          </div>
        )}
      </div>
    </main>
  )
}
