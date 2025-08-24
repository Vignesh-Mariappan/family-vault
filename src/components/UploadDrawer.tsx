"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function UploadDrawer({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string, files: File[]) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    onSubmit(title, Array.from(files || []));
    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    setFiles(null);
    onClose();
  };

  return (
    <Drawer
      open={open}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
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

          <div className="flex items-center gap-2">
            <Input
              type="file"
              id="file-upload"
              accept="image/*,.pdf"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="hidden"
            />
            <label htmlFor="file-upload">
              <Button asChild>
                <span>Choose Files</span>
              </Button>
            </label>
          </div>

          {files && files.length > 0 && (
            <div className="mt-2">
              <div>Selected Files</div>
              <ul className="flex flex-col gap-1 max-h-40 overflow-y-auto border p-2 rounded">
                {Array.from(files).map((file, index) => (
                  <li className="text-xs" key={index}>
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <DrawerFooter>
          <Button
            className="cursor-pointer"
            onClick={handleSubmit}
            disabled={loading}
            variant={"app"}
          >
            {loading ? "Uploading..." : "Submit"}
          </Button>
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
