"use client";

import { FormEvent, useState } from "react";
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
import Link from "next/link";
import { useGetAllProductsQuery } from "@/redux/features/products/productsApi";
import TableSearchForm from "@/components/shared/TableSearchForm";

const SearchMechanisms = [{ label: "اسم المنتج", value: "name" }];

export default function ProductsPage() {
  // States and Hooks
  const [search, setSearch] = useState({ name: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Queries
  const {
    data: products,
    isLoading,
    isFetching,
  } = useGetAllProductsQuery({
    page: currentPage,
    per_page: pageSize,
    search: search.name,
  });

  // Table management
  const { table } = useTanstackTable({
    columns,
    data: products?.data.data || [],
    features: ["sort", "selection", "multiSelection"],
  });

  const resetSearch = () => {
    setSearch({ name: "" });
    setCurrentPage(1);
  };

  // Handle search submit
  const handleSearchSubmit = (
    e: FormEvent,
    searchMechanism: string,
    inputValue: string
  ) => {
    e.preventDefault();
    switch (searchMechanism) {
      case "name":
        resetSearch();
        setSearch({ ...search, name: inputValue });
        break;
      default:
        resetSearch();
        break;
    }
  };

  return (
    <div className="w-full md:px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between flex-col gap-2 sm:flex-row  border-y py-2 mb-4">
        <h1 className="text-32 font-semibold">المنتجات</h1>
        <Link href="/dashboard/products/add">
          <Button
            icon={<PlusCircle />}
            dir="ltr"
            className="rounded-lg h-10 px-6"
          >
            اضف منتج جديد
          </Button>
        </Link>
      </div>
      <div className="border rounded-lg ">
        {/* Table Header */}
        <div className="flex items-center gap-4 md:gap-0 flex-col md:flex-row-reverse justify-between p-4">
          <TableSearchForm
            SearchMechanisms={SearchMechanisms}
            onSubmit={handleSearchSubmit}
          />
        </div>

        <DataTable
          table={table}
          isLoading={isLoading || isFetching}
          currentPage={products?.data.current_page!}
          pageSize={products?.data.per_page!}
          totalPages={products?.data.last_page!}
          setPageSize={(size) => setPageSize(size)}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
