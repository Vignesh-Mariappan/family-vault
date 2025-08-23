"use client";

import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function UploadDrawer({ open, onClose, onSubmit }: { open: boolean; onClose: () => void, onSubmit:  (title: string, files: File[]) => Promise<void> }) {
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Upload Personal Document</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          <Input
            placeholder="Enter document title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            type="file"
            accept="image/*,.pdf"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />
        </div>
        <DrawerFooter>
          <Button onClick={() => onSubmit(title, Array.from(files || []))} disabled={loading}>
            {loading ? "Uploading..." : "Submit"}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
