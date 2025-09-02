import saveAs from "file-saver";
import type { DocumentData } from "firebase/firestore";
import JSZip from "jszip";
import { toast } from "sonner";

export function formatBytes(bytes: number, decimals = 0): string {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

export function findSizeTextColor(sizeInBytes: number): string {
  if (sizeInBytes <= 300 * 1024) {
    // ≤ 200 KB
    return "text-green-600";
  } else if (sizeInBytes <= 500 * 1024) {
    // 201 KB – 1 MB
    return "text-yellow-600";
  } else {
    // > 1 MB
    return "text-red-600";
  }
}


  export const handleDownloadAll = async (document: any) => {
    if (typeof window === "undefined") return; // ✅ ensure client only
    if (typeof document === "undefined") return;

    if (!document.files || document.files.length === 0) {
      console.warn("No files to download for this document.");
      toast.warning("No files to download");
      return;
    }

    const zip = new JSZip();

    try {
      await Promise.all(
        document.files.map(async (file: { name: string; url: string }) => {
          const response = await fetch(file.url);
          if (!response.ok)
            throw new Error(
              `Failed to fetch ${file.name}: ${response.statusText}`
            );
          const blob = await response.blob();
          zip.file(file.name, blob);
        })
      );

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `${document.title}.zip`);

      //   const link = document.createElement("a");
      //   link.href = URL.createObjectURL(zipBlob);
      //   link.download = `${document.title}.zip`;
      //   link.click();
    } catch (error) {
      console.error("Error creating or downloading zip file:", error);
      toast.error("Error downloading files. Please try again.");
    }
  };

  export const handleDownloadFile = async (file: { name: string; url: string }) => {
    try {
      const response = await fetch(file.url);
      if (!response.ok)
        throw new Error(`Failed to fetch ${file.name}: ${response.statusText}`);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = file.name;
      link.click();
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Error downloading file. Please try again.");
    }
  };


export const getUserName = (userId: string | undefined, users: DocumentData[]) => {
  if (!userId || users?.length <= 0) {
    return '';
  }
  return users.find(user => user?.uid === userId)?.nickName || users.find(user => user?.uid === userId)?.displayName || '';
}