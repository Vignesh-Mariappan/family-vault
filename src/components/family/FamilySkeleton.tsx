import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const FamilySkeleton = () => {
  return (
    <div className="p-4 md:p-8">
      <Skeleton className="h-9 w-32 mb-6" />

      <Skeleton className="h-8 w-64 mb-4" />

      <div className="my-4 max-w-sm">
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Documents table skeleton */}
      <div className="border rounded-md max-w-5xl mx-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <Skeleton className="h-6 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-6 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-6 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-6 w-24" />
              </TableHead>
              <TableHead className="text-right">
                <Skeleton className="h-6 w-16 ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <Skeleton className="h-5 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-28" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FamilySkeleton;
