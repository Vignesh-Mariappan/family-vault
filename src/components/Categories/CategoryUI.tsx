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
import { formatBytes } from "@/utils/utils";
import { saveAs } from "file-saver";
import { doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
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
import useGetAppTheme from "@/hooks/useGetAppTheme";
import { usePagination } from "@/hooks/usePagination";
import { useFamily } from "@/context/FamilyContext";

interface CategoryUIProps {
  category: Categories;
  title: string;
}

const CategoryUI: React.FC<CategoryUIProps> = ({ category, title }) => {
  const { memberid } = useParams<{ memberid: string }>();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [documents, setDocuments] = React.useState<any[]>([]);
  const { users } = useFamily();
  const userData = users?.find((user) => user.uid === memberid);
   
  const [search, setSearch] = React.useState("");
  const isDark = useGetAppTheme();
  const tableRowColor = isDark
    ? "even:bg-zinc-900 odd:bg-background"
    : "even:bg-zinc-100 odd:bg-background";
  
  const filteredDocs = React.useMemo(() => {
    if (!search) return documents;
    const q = search.toLowerCase();
    return documents.filter((d) => (d?.title || "").toLowerCase().includes(q));
  }, [documents, search]);

  const { page, setPage, pageCount, paginatedData: paginatedDocs } = usePagination(filteredDocs, 10)

  // Reset to first page if search changes
  useEffect(() => {
    setPage(1);
  }, [search]);
  
  useEffect(() => {
    if (userData) {
      setDocuments(userData.documents?.[category] || []);
    }
  }, [userData]);

  const handleDeleteDocument = async (
    documentId: string,
    files: { name: string; url: string }[]
  ) => {
    if (!memberid || !userData) return;

    try {
      // Delete files from Firebase Storage
      await Promise.all(
        files.map(async (file) => {
          const fileRef = ref(storage, file.url); // Assuming the URL is the full path in storage
          await deleteObject(fileRef);
        })
      );

      // Remove document from user data in Firestore
      const userRef = doc(db, "users", memberid);
      const updatedDocuments = {
        ...userData.documents,
        [category]: userData.documents?.[category].filter(
          (doc: any) => doc.id !== documentId
        ),
      };

      await updateDoc(userRef, {
        documents: updatedDocuments,
      });

      // Update the local state
      setDocuments(updatedDocuments?.[category] || []);

      console.log("Document deleted successfully");
    } catch (error) {
      console.error("Error deleting document:", error);
      // Handle error (e.g., show a message to the user)
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
      console.error("Error downloading file:", error);
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

    console.log(`Document Title: ${document.title}`);
  };

  return (
    <div className="p-4">
      <Button
        variant="outline"
        // size='icon'
        className="cursor-pointer mb-4"
        onClick={() => window.history.back()}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to categories
        {/* Using X as a back arrow, you might replace this */}
      </Button>

      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      {/* ✅ Upload Button */}
      <Button
        className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700 flex items-center gap-2 cursor-pointer"
        onClick={() => setDrawerOpen(true)}
      >
        <Upload className="h-4 w-4 mr-1" />
        Upload Document
      </Button>

      {/* ✅ Upload Drawer */}
      <div className="max-w-sm">
        <UploadDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onSubmit={handleUpload} // pass handler
        />
      </div>

      <div className="my-4 max-w-sm">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={`Search your documnt by name...`}
        />
      </div>

      {/* ✅ Show Uploaded Documents */}
      <div className="mt-6">
        {paginatedDocs.length > 0 ? (
          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gradient-yellow">
                    Document Name
                  </TableHead>
                  <TableHead className="text-gradient-yellow">Size</TableHead>
                  <TableHead className="text-right text-gradient-yellow">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDocs.map((doc, index) => (
                  <TableRow className={tableRowColor} key={doc.id || index}>
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
                  </TableRow>
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
