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
  findSizeTextColor,
  formatBytes,
  handleDownloadAll,
  handleDownloadFile,
} from "@/utils/utils"; // Assuming utils contains necessary helper functions
import { ChevronLeft, ChevronRight, CloudDownload, Download, Eye } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchInput } from "../SearchInput";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { TypographyH4 } from "../ui/TypographyH4";
import { usePagination } from "@/hooks/usePagination";
import { motion } from "framer-motion";
import useScrollToTop from "@/hooks/useScrollToTop";
import { useGetFamilyDocuments } from "@/hooks/useGetFamilyDocuments";
import FamilySkeleton from "./FamilySkeleton";

const categoryBgColorMap = {
  personal: "bg-blue-700",
  educational: "bg-green-700",
  professional: "bg-purple-700",
  health: "bg-red-600",
  investments: "bg-yellow-700",
  home: "bg-sky-700",
};

type CategoryType = keyof typeof categoryBgColorMap;

const Family = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { familyMembers } = location.state || {};

  useScrollToTop();

  const { documents, loading, error } = useGetFamilyDocuments(familyMembers);
  console.log( 'fAmily docs ', documents)

  const [search, setSearch] = useState("");

  const filteredDocs = useMemo(() => {
    if (!search) return documents;
    const q = search.toLowerCase();
    return documents.filter((d) => (d?.title || "").toLowerCase().includes(q));
  }, [documents, search]);

  const { page, setPage, pageCount, paginatedData: paginatedDocs } = usePagination(filteredDocs, 10)

  // Reset to first page if search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  if (loading) {
    return <FamilySkeleton />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
            <TableHead className="text-white">
              Document Name
            </TableHead>
            <TableHead className="text-white">Category</TableHead>
            <TableHead className="text-white">Size</TableHead>
            <TableHead className="text-white">Created By</TableHead>
            <TableHead className="text-center text-white">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedDocs?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No documents found
              </TableCell>
            </TableRow>
          ) : (
            paginatedDocs?.sort((doc1, doc2) => doc1.title.localeCompare(doc2.title))?.map((doc, index) => (
              <motion.tr
              key={doc.id || index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
                <TableCell className="text-sm">{doc.title}</TableCell>
                <TableCell className="text-sm capitalize">
                  <Badge
                    className={`${
                      categoryBgColorMap[doc.category as CategoryType] ||
                      "bg-gray-500"
                    } text-white`}
                  >
                    {doc.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs">
                  {doc.files && doc.files.length >= 0 ? (
                    <div
                      className={findSizeTextColor(
                        doc.files.reduce(
                          (
                            total: number,
                            file: { name: string; url: string; size: number }
                          ) => total + (file.size || 0),
                          0
                        )
                      )}
                    >
                      {formatBytes(
                        doc.files.reduce(
                          (
                            total: number,
                            file: { name: string; url: string; size: number }
                          ) => total + (file.size || 0),
                          0
                        )
                      )}
                    </div>
                  ) : (
                    "0 Bytes"
                  )}
                </TableCell>
                <TableCell className="text-sm">{doc.createdBy}</TableCell>
                <TableCell className="flex justify-center gap-4 text-sm">
                  <div className="flex justify-end space-x-2">
                    {/* View Icon */}
                    {doc.files && doc.files.length >= 0 && (
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
                                        variant="outline"
                                        className="cursor-pointer"
                                        size="icon"
                                        aria-label={`Download ${file.name}`}
                                        onClick={() =>
                                          handleDownloadFile(file)
                                        }
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )
                                )}
                              </div>
                              <Separator />
                              <div className="flex justify-end">
                                {doc.files.length > 0 && (
                                  <Button onClick={() => handleDownloadAll(doc)}>
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
                  </div>
                </TableCell>
              </motion.tr>
            ))
          )}
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
    </div>
  );
};

export default Family;
