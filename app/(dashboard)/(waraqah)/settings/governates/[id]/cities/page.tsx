"use client";

import { useState } from "react";
import { PlusCircle, Undo2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortDropdown } from "@/components/shared/SortDropdown";
import DataTable from "@/components/shared/DataTable";
import { columns } from "./columns";
import { useTanstackTable } from "@/hooks/use-tanstack-table";
import AddCategorySheet from "@/components/categories/AddCategorySheet";
import { useGetAllCategoriesQuery } from "@/redux/features/(waraqah)/categories/categoriesApi";
import { useAppDispatch } from "@/redux/app/hooks";
import {
  useGetAdminCitiesQuery,
  useGetAdminGovernatesQuery,
} from "@/redux/features/(waraqah)/settings/settingsApi";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function ProductsPage() {
  // States and Hooks
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: governates } = useGetAdminGovernatesQuery({
    page: currentPage,
    per_page: 100,
  });

  const {
    data: cities,
    isLoading,
    isFetching,
  } = useGetAdminCitiesQuery({
    page: currentPage,
    per_page: pageSize,
    governateId: Number(id),
  });

  // Table management
  const { table, setSortingColumn, getSearchVal, setSearchVal } =
    useTanstackTable({
      columns,
      data: cities?.data.data || [],
      features: ["sort", "selection", "multiSelection", "filter"],
    });

  return (
    <div className="w-full px-2 md:px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between flex-col gap-2 sm:flex-row  border-y py-2 mb-4">
        <h1 className="flex items-center gap-2 text-32 font-semibold">
          <span>المحافظات</span>
          <span>-</span>

          {governates ? (
            <span>
              {governates.data.data.find((g) => g.id === Number(id))?.name}
            </span>
          ) : (
            <Skeleton className="w-44 h-8" />
          )}
        </h1>

        <Link href="/dashboard/settings/governates">
          <Button icon={<Undo2 />} className="rounded-lg">
            العودة إلى المحافظات
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg">
        <DataTable
          table={table}
          isLoading={isLoading || isFetching}
          currentPage={cities?.data.current_page!}
          pageSize={cities?.data.per_page!}
          totalPages={cities?.data.last_page!}
          setPageSize={(size) => setPageSize(size)}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
