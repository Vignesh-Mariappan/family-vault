import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { db, storage } from "@/firebase/firebase";
import { Categories } from "@/utils/types";
import { uploadDocument } from "@/utils/uploadDocument"; // ✅ util function
import { formatBytes, getUserName } from "@/utils/utils";
import { saveAs } from "file-saver";
import { doc, updateDoc } from "firebase/firestore";
import { deleteObject, getMetadata, ref } from "firebase/storage";
import JSZip from "jszip";
import {
  ChevronLeft,
  ChevronRight,
  CloudDownload,
  Download,
  Eye,
  FileText,
  Trash2,
  Upload,
} from "lucide-react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { UploadDrawer } from "../UploadDrawer";
import { SearchInput } from "../SearchInput";
import { usePagination } from "@/hooks/usePagination";
import { useFamily } from "@/context/FamilyContext";
import { motion } from "framer-motion";
import { TypographyH2 } from '../ui/TypographyH2'
import { useCategoryDocuments } from "@/hooks/useCategoryDocuments";

interface CategoryUIProps {
  category: Categories;
  title: string;
}

const CategoryUI: React.FC<CategoryUIProps> = ({ category, title }) => {
  const { memberid } = useParams<{ memberid: string }>();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const { users } = useFamily();
  const userDisplayName = getUserName(memberid, users);
  const {docs, userData} = useCategoryDocuments(memberid, category);
   
  const [search, setSearch] = React.useState("");
  
  const filteredDocs = React.useMemo(() => {
    if (!docs) return [];
    if (!search) return docs;
    const q = search.toLowerCase();
    return docs.filter((d: any) => (d?.title || "").toLowerCase().includes(q)).sort((doc1, doc2) => doc1.title.localeCompare(doc2.title));
  }, [docs, search]);


  const { page, setPage, pageCount, paginatedData: paginatedDocs } = usePagination(filteredDocs, 10)

  // Reset to first page if search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleDeleteDocument = async (
    documentId: string,
    files: { name: string; url: string }[]
  ) => {
    if (!memberid || !userData) return;
  
    try {
      // 1️⃣ Delete files from Firebase Storage
      await Promise.all(
        files.map(async (file) => {
          const fileRef = ref(storage, file.url); // must be storage path
  
          try {
            await getMetadata(fileRef);
            await deleteObject(fileRef);
          } catch (error: any) {
            if (error.code === "storage/object-not-found") {
              console.warn("File not found, skipping:", file.url);
            } else {
              console.error("Error deleting file:", file.url, error);
            }
          }
        })
      );
  
      // 2️⃣ Correct Firestore update (THIS IS THE FIX)
      const userRef = doc(db, "users", memberid);
  
      const updatedDocuments = {
        ...userData.documents, // ✅ ONLY documents
        [category]: userData.documents?.[category]?.filter(
          (doc: any) => doc.id !== documentId
        ),
      };
  
      await updateDoc(userRef, {
        documents: updatedDocuments,
      });
  
      toast.success("Document removed from the vault successfully!");
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Error removing the document from the vault!");
    }
  };
  

  const handleDownloadAll = async (document: any) => {
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
    } catch (error) {
      console.error("Error creating or downloading zip file:", error);
      toast.error("Error downloading files. Please try again.");
    }
  };

  const handleDownloadFile = async (file: { name: string; url: string }) => {
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
      toast.error("Error downloading file. Please try again.");
    }
  };
  // ✅ Handle submit from UploadDrawer
  const handleUpload = async (title: string, files: File[]) => {
    if (!memberid) return;

    try {
      await uploadDocument(memberid, Categories?.[category], title, files);
      setDrawerOpen(false);
      toast.success("Your document is safe in the vault! 🚀");
    } catch (error) {
      toast.error("Upload error! Try again in a moment.");
    }
    // Fallback for browsers that don't support navigator.share
  };


  return (
    <div className="px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          // variant="ghost"
          // size='icon'
          className="cursor-pointer mb-4"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to categories
          {/* Using X as a back arrow, you might replace this */}
        </Button>
      </motion.div>

      { userDisplayName && <TypographyH2 additionalClasses="text-center mx-auto w-full my-4" text={userDisplayName} /> }

      <motion.h2
        className="text-xl font-semibold mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {title}
      </motion.h2>

      {/* ✅ Upload Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          onClick={() => setDrawerOpen(true)}
          className="
            flex items-center gap-2
            rounded-lg
            bg-indigo-600
            border border-indigo-600
            px-5 py-2.5
            text-sm font-semibold text-white
            cursor-pointer
            transition-all duration-200
            hover:bg-indigo-700 hover:border-indigo-700
          "
        >
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </motion.div>

      {/* ✅ Upload Drawer */}
      <div className="max-w-sm">
        <UploadDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onSubmit={handleUpload} // pass handler
        />
      </div>

      <motion.div
        className="my-4 max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={`Search your documnt by name...`}
        />
      </motion.div>

      {/* ✅ Show Uploaded Documents */}
      <div className="mt-6">
        {paginatedDocs.length > 0 ? (
          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">
                    Document Name
                  </TableHead>
                  <TableHead className="text-white">Size</TableHead>
                  <TableHead className="text-right text-white">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-transparent">
                {paginatedDocs?.sort((doc1, doc2) => doc1.title.localeCompare(doc2.title)).map((doc, index) => (
                  <motion.tr
                    key={doc.id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <TableCell className="text-md">{doc.title}</TableCell>
                    <TableCell className="text-xs">
                      {doc.files && doc.files.length >= 0
                        ? formatBytes(
                            doc.files.reduce(
                              (
                                total: number,
                                file: {
                                  name: string;
                                  url: string;
                                  size: number;
                                }
                              ) => total + (file.size || 0),
                              0
                            )
                          )
                        : "0 Bytes"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {/* View Icon (Opens the first file in a new tab) */}
                        {doc.files &&
                          doc.files.length >= 0 && ( // Check if files array exists and has elements
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="cursor-pointer"
                                      size="icon"
                                      aria-label="View Documents"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>
                                        {doc.title} - Files
                                      </DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      {doc.files.map(
                                        (file: any, fileIndex: number) => (
                                          <div
                                            key={fileIndex}
                                            className="flex justify-between items-center"
                                          >
                                            <a
                                              href={file.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-blue-600 text-sm hover:underline"
                                            >
                                              {file.name}
                                            </a>
                                            <Button
                                              variant="outline"
                                              className="cursor-pointer"
                                              size="icon"
                                              aria-label={`Download ${file.name}`}
                                              onClick={() =>
                                                handleDownloadFile(file)
                                              }
                                            >
                                              <Download className="h-4 w-4" />
                                              {/* Download */}
                                            </Button>
                                          </div>
                                        )
                                      )}
                                    </div>
                                    <Separator />
                                    <div className="flex justify-end">
                                      {doc.files.length > 0 && (
                                        <Button
                                          onClick={() => handleDownloadAll(doc)}
                                        >
                                          <CloudDownload className="h-4 w-4 mr-2 cursor-pointer" />
                                          Download All
                                        </Button>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View Documents</p>
                              </TooltipContent>
                            </Tooltip>
                          )}

                        {/* Share Icon (Placeholder) */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              className="cursor-pointer"
                              size="icon"
                              aria-label="View Documents"
                              onClick={() => handleDownloadAll(doc)}
                            >
                              <CloudDownload className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Download as zip</p>
                          </TooltipContent>
                        </Tooltip>

                        {/* Delete Icon */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="cursor-pointer"
                                  size="icon"
                                  aria-label="Delete Document"
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-40 shadow-md border bg-background">
                                <p className="text-sm mb-2">Are you sure?</p>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteDocument(doc.id, doc.files)
                                  }
                                >
                                  Yes, delete
                                </Button>
                              </PopoverContent>
                            </Popover>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Document</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
            {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-4 mt-4">
 <Button
          variant="outline"
          className="cursor-pointer"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
 size="icon"
        >
 <ChevronLeft className="h-4 w-4" />
        </Button>
        <span>
          Page {page} of {pageCount || 1}
        </span>
 <Button
          variant="outline"
          className="cursor-pointer"
          disabled={page === pageCount || pageCount === 0}
          onClick={() => setPage((p) => p + 1)}
 size="icon"
        >
 <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
          </TooltipProvider>


        ) : (
          <div className="flex flex-col items-center justify-center py-8 bg-muted rounded-lg border border-dashed border-gray-300">
            <FileText className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground text-base font-medium">
              No {category.toLowerCase()} documents uploaded yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryUI;
