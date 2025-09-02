import { storage, db } from "../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import type { Categories } from "./types";
import { toast } from "sonner";

export const uploadDocument = async (
  userId: string,
  category: Categories,
  title: string,
  files: File[]
) => {
  if (!files || files.length === 0) throw new Error("No files selected");

  const uploadedFiles = [];

  toast.info('Document uploading in progress!')

  for (const file of files) {
    const fileRef = ref(storage, `documents/${userId}/${category}/${title}/${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);

    uploadedFiles.push({
      name: file.name,
      url,
      type: file.type,
      size: file.size,
    });
  }

  const userRef = doc(db, "users", userId);
  const docEntry = {
    id: uuidv4(),
    title,
    files: uploadedFiles,
    uploadedAt: new Date().toISOString(),
  };

  await updateDoc(userRef, {
    [`documents.${category}`]: arrayUnion(docEntry),
  });

  return docEntry;
};
