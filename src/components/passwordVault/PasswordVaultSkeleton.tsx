import { Skeleton } from "@/components/ui/skeleton";

const PasswordVaultSkeleton = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Password List Skeleton */}
        <div className="md:col-span-1 space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Password Details Skeleton */}
        <div className="md:col-span-2">
          <div className="p-6 border rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <Skeleton className="h-7 w-32" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordVaultSkeleton;
