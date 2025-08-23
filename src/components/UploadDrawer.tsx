"use client";

import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function UploadDrawer({ open, onClose, onSubmit }: { open: boolean; onClose: () => void, onSubmit:  (title: string, files: File[]) => Promise<void> }) {
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    onSubmit(title, Array.from(files || []));
    handleClose();
  }

  const handleClose = () => {
    setTitle("");
    setFiles(null);
    onClose();
  }

  return (
    <Drawer open={open} onOpenChange={(open) => {
      if (!open) handleClose();
    }}>
      <DrawerContent className="max-w-3xl mx-auto">
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
          <Button className="cursor-pointer" onClick={handleSubmit} disabled={loading}>
            {loading ? "Uploading..." : "Submit"}
          </Button>
          <Button className="cursor-pointer" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
