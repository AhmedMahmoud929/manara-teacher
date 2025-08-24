import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DeleteConfirmationDialog } from "../DeleteConfirmationDialog";

export function TableDropdown({
  onDelete,
  onEdit,
  viewBtn = "عرض",
  viewHref = "#",
  deleteName,
}: {
  onDelete: () => void;
  onEdit: () => void;
  deleteName: string;

  viewBtn?: string;
  viewHref?: string;
}) {
  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-white rounded-md shadow-md"
      >
        <DropdownMenuItem asChild>
          <Link
            href={viewHref}
            className="flex flex-row py-3 px-4 hover:bg-[#f5f5f5] cursor-pointer"
          >
            <Eye className="h-5 w-5" />
            <span className="text-right">{viewBtn}</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onEdit}
          className="flex flex-row py-3 px-4 hover:bg-[#f5f5f5] cursor-pointer"
        >
          <Pencil className="h-5 w-5" />
          <span className="text-right">تعديل</span>
        </DropdownMenuItem>

        <DeleteConfirmationDialog onDelete={onDelete} name={deleteName}>
          <div className="flex items-center gap-1 flex-row py-3 px-4 hover:!bg-[#ffe9e9] cursor-pointer text-red-600 hover:!text-red-700">
            <Trash2 className="h-4 w-4" />
            <span className="text-right">حذف</span>
          </div>
        </DeleteConfirmationDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
