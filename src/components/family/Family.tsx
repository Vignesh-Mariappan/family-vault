import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  formatBytes,
  handleDownloadAll,
  handleDownloadFile,
} from "@/utils/utils";
import { ChevronLeft, CloudDownload, Download, Eye } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { TypographyH4 } from "../ui/TypographyH4";
import { Separator } from "../ui/separator";
import { useState, useMemo } from "react";
import { SearchInput } from "../SearchInput";

const Family = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { familyUsersData } = location.state || {};

  // Flatten the familyUsersData into a single array of documents with metadata
  const documents =
    familyUsersData?.flatMap((member: any) =>
      Object.entries(member.documents || {}).flatMap(([category, docs]) =>
        (docs as any[]).map((doc) => ({
          ...doc,
          category: category?.toLowerCase(),
          createdBy: member?.nickName || member?.displayName,
        }))
      )
    ) || [];

  const [search, setSearch] = useState("");

  const filteredDocs = useMemo(() => {
    if (!search) return documents;
    const q = search.toLowerCase();
    return documents.filter((d) => (d?.title || "").toLowerCase().includes(q));
  }, [documents, search]);

  console.log("Family Users Data:", familyUsersData);
  console.log("Flattened Documents:", documents);

  return (
    <div className="p-6">
      {/* Back button */}
      <Button
        variant="outline"
        onClick={() => navigate("/")}
        className="mb-6 flex items-center gap-2 cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Home
      </Button>

      <TypographyH4 text="Family Documents"></TypographyH4>

      <div className="my-4 max-w-sm">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={`Search your documnt by name...`}
        />
      </div>

      {/* Documents table */}
      <Table className="max-w-5xl mx-auto">
        <TableHeader>
          <TableRow>
            <TableHead>Document Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDocs?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No documents found
              </TableCell>
            </TableRow>
          ) : (
            filteredDocs?.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="text-sm">{doc.title}</TableCell>
                <TableCell className="text-sm">{doc.category}</TableCell>
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
                <TableCell className="text-sm">{doc.createdBy}</TableCell>
                <TableCell className="flex justify-center gap-4 text-sm">
                  <div className="flex justify-end space-x-2">
                    {/* View Icon (Opens the first file in a new tab) */}
                    {doc.files &&
                      doc.files.length >= 0 && ( // Check if files array exists and has elements
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="secondary"
                                  className="cursor-pointer"
                                  size="icon"
                                  aria-label="View Documents"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>{doc.title} - Files</DialogTitle>
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
                                          variant="secondary"
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
                          variant="secondary"
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
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Family;
