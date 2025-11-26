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
                <div className="md:col-span-1 space-y-4">
                    <Skeleton className="h-20 w-full bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg" />
                    <Skeleton className="h-20 w-full bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg" />
                    <Skeleton className="h-20 w-full bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg" />
                    <Skeleton className="h-20 w-full bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg" />
                    <Skeleton className="h-20 w-full bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg" />
                </div>

                {/* Password Details Skeleton */}
                <div className="md:col-span-2">
                    <div className="p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <Skeleton className="h-7 w-32" />
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-5 rounded-full" />
                                <Skeleton className="h-5 w-5 rounded-full" />
                            </div>
                        </div>

                        {/* Skeleton for username/email */}
                        <div className="space-y-2 mb-4">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-6 w-full" />
                        </div>

                        {/* Skeleton for password */}
                        <div className="space-y-2 mb-4">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-6 w-full" />
                        </div>

                        {/* Skeleton for last updated */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordVaultSkeleton;
