"use client";

import { useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreVertical, Pencil, PlusCircle, Search, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SortCell from "@/components/shared/SortCell";
import { TableDropdown } from "@/components/shared/TableDropdown";
import ProductCell from "@/components/shared/ProductCell";
import { SortDropdown } from "@/components/shared/SortDropdown";
import DataTable from "@/components/shared/DataTable";
import { columns } from "./columns";
import { useTanstackTable } from "@/hooks/use-tanstack-table";
import Link from "next/link";
import { useGetAllProductsQuery } from "@/redux/features/products/productsApi";
import { useGetInventoryQuery } from "@/redux/features/(waraqah)/inventory/inventoryApi";
import AddInventoryForm from "@/components/inventory/AddInventoryForm";

const SearchMechanisms = [{ label: "رقم المنتج", value: "product_id" }];

const SORT_OPTIONS = [
  { label: "الأحدث أولاً", value: "newest" },
  { label: "الأقدم أولاً", value: "oldest" },
  { label: "السعر: من الأعلى إلى الأقل", value: "price-desc" },
  { label: "السعر: من الأقل إلى الأعلى", value: "price-asc" },
  { label: "الكمية: من الأعلى إلى الأقل", value: "quantity-desc" },
  { label: "الكمية: من الأقل إلى الأعلى", value: "quantity-asc" },
];

export default function InventoryPage() {
  // States and Hooks
  const [searchMechanism, setSearchMechanism] = useState(SearchMechanisms[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Queries

  const {
    data: inventory,
    isLoading,
    isFetching,
  } = useGetInventoryQuery(
    {
      page: currentPage,
      per_page: pageSize,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  // Table management
  const { table, setSorting, getSearchVal, setSearchVal } = useTanstackTable({
    columns,
    data: inventory?.data.data || [],
    features: ["sort", "selection", "multiSelection", "filter"],
  });

  // Functions
  const handleSortChange = (value: string) => {
    switch (value) {
      case "newest":
        setSorting([{ id: "createdAt", desc: true }]);
        break;
      case "oldest":
        setSorting([{ id: "createdAt", desc: false }]);
        break;
      case "price-desc":
        setSorting([{ id: "price", desc: true }]);
        break;
      case "price-asc":
        setSorting([{ id: "price", desc: false }]);
        break;
      case "quantity-desc":
        setSorting([{ id: "quantity", desc: true }]);
        break;
      case "quantity-asc":
        setSorting([{ id: "quantity", desc: false }]);
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full px-2 md:px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between flex-col gap-2 sm:flex-row  border-y py-2 mb-4">
        <h1 className="text-32 font-semibold">المخزون</h1>
        <AddInventoryForm>
          <Button
            icon={<PlusCircle />}
            dir="ltr"
            className="rounded-lg h-10 px-6"
          >
            اضف عنصر جديد
          </Button>
        </AddInventoryForm>
      </div>
      <div className="border rounded-lg ">
        {/* Table Header */}
        <div className="flex items-center gap-4 md:gap-0 flex-col md:flex-row-reverse justify-between p-4">
          {/* <div className="flex gap-2 self-start md:self-end">
            <Select
              defaultValue={SearchMechanisms[0].value}
              onValueChange={(value) =>
                setSearchMechanism(
                  SearchMechanisms.find((s) => s.value === value)!
                )
              }
            >
              <SelectTrigger className="w-[110px] lg:w-[180px]">
                <SelectValue placeholder="البحث حسب" />
              </SelectTrigger>
              <SelectContent>
                {SearchMechanisms.map(({ label, value }, ix) => (
                  <SelectItem value={value} key={ix}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder={`البحث عن طريق ${searchMechanism.label}...`}
              value={getSearchVal(searchMechanism.value)}
              onChange={(e) =>
                setSearchVal(searchMechanism.value, e.target.value)
              }
              className="max-w-44 lg:max-w-sm bg-gray-50 border shadow-none"
            />
          </div> */}

          {/* <SortDropdown
            title="ترتيب حسب"
            onChange={handleSortChange}
            align="end"
            className="self-start md:self-end"
            sortOptions={SORT_OPTIONS}
          /> */}
        </div>

        <DataTable
          table={table}
          isLoading={isLoading || isFetching}
          currentPage={inventory?.data.current_page!}
          pageSize={inventory?.data.per_page!}
          totalPages={inventory?.data.last_page!}
          setPageSize={(size) => setPageSize(size)}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
