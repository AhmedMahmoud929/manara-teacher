import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

function CourseCell({
  title,
  id,
  image,
  titleClassName,
}: {
  title: string;
  id: number;
  image: string;
  titleClassName?: string;
}) {
  return (
    <div className="flex items-start gap-2 w-full">
      <div className="relative overflow-hidden w-12 h-12 rounded-lg">
        <Image src={image} alt={title} fill className="object-contain" />
      </div>
      <div className="flex flex-col w-full">
        <span
          className={cn(
            "text-14 font-medium mb-1 whitespace-pre-wrap",
            titleClassName
          )}
        >
          {title}
        </span>
        <span className="text-12 text-black/70 font-light">{id}#</span>
      </div>
    </div>
  );
}

export default CourseCell;
