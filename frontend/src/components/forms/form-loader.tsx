import { Loader2 } from 'lucide-react';

import { Skeleton } from '../ui/skeleton';

export const FormLoader = () => {
  return (
    <div className="flex gap-3 justify-between flex-col relative">
      <div className="flex gap-5">
        <Skeleton className="h-10 flex-2 w-[40%] mb-3" />
        <Skeleton className="h-10 w-full flex-3 mb-3" />
      </div>

      <div className="flex gap-5">
        <Skeleton className="h-10 w-full mb-3" />
        <Skeleton className="h-10 w-[60%] mb-3" />
      </div>

      <div className="flex gap-5">
        <Skeleton className="h-10 w-full mb-3" />
        <Skeleton className="h-10 w-full mb-3" />
      </div>
      <div className="flex absolute z-20 inset-0 items-center justify-center flex-col">
        <Loader2 className="animate-spin" />
        <p>Loading...</p>
      </div>
      <div className="flex gap-5">
        <Skeleton className="h-10 flex-2 w-[40%] mb-3" />
        <Skeleton className="h-10 w-full flex-3 mb-3" />
      </div>

      <div className="flex gap-5">
        <Skeleton className="h-10 w-full mb-3" />
        <Skeleton className="h-10 w-[60%] mb-3" />
      </div>

      <div className="flex gap-5">
        <Skeleton className="h-10 w-full mb-3" />
        <Skeleton className="h-10 w-full mb-3" />
      </div>
    </div>
  );
};
