import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function CourseSkeleton() {
  return (
    <div className="flex flex-col gap-12 h-[80vh] pt-12">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <Skeleton className="w-60 h-4" />
          <Skeleton className="w-44 h-3" />
          <Skeleton className="w-20 h-4" />
        </div>
        <Skeleton className="w-52 h-12" />
      </div>
      <div className="h-20 flex gap-4">
        <Skeleton className="h-full w-1/4" />
        <Skeleton className="h-full w-1/4" />
        <Skeleton className="h-full w-1/4" />
        <Skeleton className="h-full w-1/4" />
      </div>
      <div className="flex-1 space-y-4">
        <Skeleton className="w-full h-1/3" />
        <Skeleton className="w-full h-1/3" />
        <Skeleton className="w-full h-1/3" />
      </div>
    </div>
  );
}

export default CourseSkeleton;
