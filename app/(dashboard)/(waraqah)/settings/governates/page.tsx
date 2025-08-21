"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";

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
import { useGetAdminGovernatesQuery } from "@/redux/features/(waraqah)/settings/settingsApi";

const SearchMechanisms = [{ label: "اسم القسم", value: "name" }];

const SORT_OPTIONS = [
  { label: "الأحدث أولاً", value: "newest" },
  { label: "الأقدم أولاً", value: "oldest" },
];

export default function ProductsPage() {
  // States and Hooks
  const [searchMechanism, setSearchMechanism] = useState(SearchMechanisms[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Queries
  const {
    data: governates,
    isLoading,
    isFetching,
  } = useGetAdminGovernatesQuery({
    page: currentPage,
    per_page: pageSize,
  });

  // Table management
  const { table, setSortingColumn, getSearchVal, setSearchVal } =
    useTanstackTable({
      columns,
      data: governates?.data.data || [],
      features: ["sort", "selection", "multiSelection", "filter"],
    });

  return (
    <div className="w-full px-2 md:px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between flex-col gap-2 sm:flex-row  border-y py-2 mb-4">
        <h1 className="text-32 font-semibold">المحافظات</h1>
      </div>

      <div className="border rounded-lg">
        <DataTable
          table={table}
          isLoading={isLoading || isFetching}
          currentPage={governates?.data.current_page!}
          pageSize={governates?.data.per_page!}
          totalPages={governates?.data.last_page!}
          setPageSize={(size) => setPageSize(size)}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
