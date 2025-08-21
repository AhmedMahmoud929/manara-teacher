"use client";

import { useState, FormEvent } from "react";
import { PlusCircle, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataTable from "@/components/shared/DataTable";
import { columns } from "./columns";
import { useTanstackTable } from "@/hooks/use-tanstack-table";
import AddUserSheet from "@/components/customer/AddUserSheet";
import { useGetAllUsersQuery } from "@/redux/features/(waraqah)/user/userApi";
import TableSearchForm from "@/components/shared/TableSearchForm";

const SearchMechanisms = [{ label: "رقم الهاتف", value: "phone" }];

export default function ProductsPage() {
  // States and Hooks
  const [search, setSearch] = useState({ phone: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Queries
  const {
    data: users,
    isLoading,
    isFetching,
  } = useGetAllUsersQuery({
    page: currentPage,
    per_page: pageSize,
    phone: search.phone,
  });

  const resetSearch = () => {
    setSearch({ phone: "" });
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
      case "phone":
        resetSearch();
        setSearch({ ...search, phone: inputValue });
        break;
      default:
        resetSearch();
        break;
    }
  };

  // Table management
  const { table } = useTanstackTable({
    columns,
    data: users?.data.data || [],
    features: ["selection", "multiSelection"],
  });

  return (
    <div className="w-full px-2 md:px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between flex-col gap-2 sm:flex-row  border-y py-2 mb-4">
        <h1 className="text-32 font-semibold">العملاء</h1>
        <AddUserSheet>
          <Button
            icon={<PlusCircle />}
            dir="ltr"
            className="rounded-lg h-10 px-6"
          >
            اضف عميل جديد
          </Button>
        </AddUserSheet>
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
          currentPage={users?.data.current_page!}
          pageSize={users?.data.per_page!}
          totalPages={users?.data.last_page!}
          setPageSize={(size) => setPageSize(size)}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
