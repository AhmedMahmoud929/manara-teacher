import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

function CustomerCell({
  title,
  id,
  image,
}: {
  title: string;
  id: number;
  image: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="hidden overflow-hidden w-12 h-12 rounded-full">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>{title.slice(0, 2)}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col">
        <span className="text-14 font-medium mb-1 line-clamp-1">{title}</span>
        <span className="text-12 text-black/70 font-light">{id}#</span>
      </div>
    </div>
  );
}

export default CustomerCell;
