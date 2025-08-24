import CourseCell from "@/components/shared/CourseCell";
import SortCell from "@/components/shared/SortCell";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import {
  Loader,
  Pencil,
  Trash2,
  Check,
  X,
  EllipsisVertical,
  Eye,
  BookOpen,
  Star,
  Clock,
  User,
  PlayCircle,
  BookMarked,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog";
import { useDeleteCourseMutation } from "@/redux/features/courses/coursesApi";
import { handleReqWithToaster } from "@/lib/handle-req-with-toaster";
import { ICourse } from "@/types/course";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { API_URL } from "@/constants/env";

// Define the columns
export const columns: ColumnDef<ICourse>[] = [
  // Checkboxes
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex-center pr-4 pl-2">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="تحديد الكل"
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex-center pr-2">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="تحديد الصف"
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // Product
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <SortCell
          label="الكورس"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start whitespace-nowrap lg:w-64 gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      console.log(row.original.image);
      const image = row.original.image.startsWith("http")
        ? row.original.image
        : `${API_URL}/${row.original.image}`;
      const imageUrl = image;
      return (
        <div className="p-2">
          <CourseCell
            title={row.original.title}
            id={row.original.id}
            image={imageUrl}
          />
          {/* <ProductDetailsDialog product={row.original}>
          </ProductDetailsDialog> */}
        </div>
      );
    },
  },

  // Final Price
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <SortCell
          label="السعر"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start gap-1 cursor-pointer lg:w-32 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const price = Number.parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("ar-EG", {
        style: "currency",
        currency: "EGP",
      }).format(price);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },

  // Average Rating (Stats section starts here)
  {
    accessorKey: "average_rating",
    header: ({ column }) => {
      return (
        <SortCell
          label="التقييم"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const rating = 4.2; // FIXME: Change the rating to be real;
      return (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
          {/* <span>{rating.toFixed(1)}</span> */}
          <pre> -</pre>
        </div>
      );
    },
  },

  // // Completion Rate
  // {
  //   accessorKey: "completion_rate",
  //   header: ({ column }) => {
  //     return (
  //       <SortCell
  //         label="معدل الإنجاز"
  //         isAscSorted={column.getIsSorted() === "asc"}
  //         className="flex items-center justify-start gap-1 cursor-pointer whitespace-nowrap"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       />
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const rate = 14; // FIXME: Change the rate to be real;
  //     return (
  //       <div className="flex items-center gap-1">
  //         <pre> -</pre>
  //       </div>
  //     );
  //   },
  // },

  // Total Lessons
  // {
  //   accessorKey: "total_lessons",
  //   header: ({ column }) => {
  //     return (
  //       <SortCell
  //         label="عدد الدروس"
  //         isAscSorted={column.getIsSorted() === "asc"}
  //         className="flex items-center justify-start gap-1 cursor-pointer whitespace-nowrap lg:w-32"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       />
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const lessons = 24; // FIXME: Change the lessons to be real;
  //     return (
  //       <div className="flex items-center gap-1">
  //         <PlayCircle className="h-4 w-4 text-blue-500" />
  //         <span>- درس</span>
  //       </div>
  //     );
  //   },
  // },

  // Total Units
  {
    accessorKey: "total_units",
    header: ({ column }) => {
      return (
        <SortCell
          label="عدد الوحدات"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start gap-1 cursor-pointer whitespace-nowrap lg:w-32"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const units = 40; // FIXME: Change the units to be real
      return (
        <div className="flex items-center gap-1">
          <BookMarked className="h-4 w-4 text-green-500" />
          <pre> -</pre>
        </div>
      );
    },
  },

  // Duration Hours
  {
    accessorKey: "duration_hours",
    header: ({ column }) => {
      return (
        <SortCell
          label="المدة (ساعة)"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start gap-1 cursor-pointer whitespace-nowrap lg:w-32"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const hours = 12; // FIXME: Change the hours to be real
      return (
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-purple-500" />
          {/* <span>{hours} ساعة</span> */}
          <pre> -</pre>
        </div>
      );
    },
  },

  // Is Active
  {
    accessorKey: "is_active",
    header: ({ column }) => {
      return (
        <SortCell
          label="نشط"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start gap-1 cursor-pointer whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const isActive =
        row.original.is_active !== undefined
          ? Boolean(Number(row.original.is_active))
          : true;

      return (
        <div className="flex justify-center">
          {isActive ? (
            <Check className="h-5 w-5 text-green-500" />
          ) : (
            <X className="h-5 w-5 text-red-500" />
          )}
        </div>
      );
    },
  },

  // Actions (moved to the end)
  {
    id: "actions",
    header: () => <div className="text-center text-base w-16">إجراء</div>,
    cell: ({ row }) => {
      const [deleteCourse] = useDeleteCourseMutation();

      const handleDelete = () => {
        handleReqWithToaster("جاري حذف الدورة...", async () => {
          await deleteCourse(row.original.id).unwrap();
        });
      };

      return (
        <div className="flex-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button size={"icon"} variant={"ghost"}>
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem className="cursor-pointer">
                <Link
                  href={`/courses/${row.original.id}`}
                  className="flex gap-2"
                >
                  <Eye className="ml-2 h-4 w-4" />
                  عرض التفاصيل
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Link
                  href={`/courses/${row.original.id}/edit`}
                  className="flex gap-2"
                >
                  <Pencil className="ml-2 h-4 w-4" />
                  تعديل
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <DeleteConfirmationDialog
                  onDelete={handleDelete}
                  name={"الدورة"}
                >
                  <div className="flex items-center gap-2 text-red-600 py-1 hover:bg-red-50/50 w-full cursor-pointer">
                    <Trash2 className="ml-4 h-4 w-4" />
                    حذف
                  </div>
                </DeleteConfirmationDialog>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
