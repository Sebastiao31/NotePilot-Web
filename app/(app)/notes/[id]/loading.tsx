import { IconLoader2 } from "@tabler/icons-react";

export default function Loading() {
    
    return <div className="h-screen w-full flex items-center justify-center">
      <IconLoader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  }