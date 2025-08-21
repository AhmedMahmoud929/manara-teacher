"use client";

import { useState } from "react";
import { File, PlusCircle, Share } from "lucide-react";

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
import { useGetSalesQuery } from "@/redux/features/sales/salesApi";
import DateRangeFilter from "../../../../components/sales/DateRangeFilter";
import { ProductSelect } from "../../../../components/sales/ProductDropdown";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { IProduct } from "@/types/(waraqah)/product";
import { ISale } from "@/types/(waraqah)/sale";
import { arSA } from "date-fns/locale";
import { handleReqWithToaster } from "@/lib/handle-req-with-toaster";
import { API_URL } from "@/constants/env";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/app/hooks";

const FILTER_OPTIONS = [
  { label: "يومي", value: "daily" },
  { label: "شهري", value: "monthly" },
  { label: "الكل", value: "total" },
];

export default function ProductsPage() {
  // States and Hooks
  const [filterType, setFilterType] = useState(FILTER_OPTIONS[0].value);
  const [activeProduct, setActiveProduct] = useState<IProduct | null>(null);
  const { token } = useAppSelector((state) => state.auth);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date("2025-4-15"),
    to: addDays(new Date(), 30),
  });

  // Queries
  const {
    data: sales,
    isLoading,
    isFetching,
  } = useGetSalesQuery(
    {
      type: filterType,
      from: format(dateRange?.from!, "yyyy-MM-dd"),
      to: format(dateRange?.to!, "yyyy-MM-dd"),
      product_id: activeProduct ? activeProduct.id.toString() : "",
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  // Table management
  const { table, setSortingColumn, getSearchVal, setSearchVal } =
    useTanstackTable({
      columns,
      data: sales?.data.sales || [],
      features: ["sort", "selection", "multiSelection", "filter"],
    });

  // Functions
  const handleDateChange = (value: DateRange) => {
    setDateRange(value);
    console.log(dateRange);
  };

  // CSV Export function
  const exportToCsv = () =>
    handleReqWithToaster("جاري تصدير البيانات...", async () => {
      try {
        const res = await fetch(
          `${API_URL}admin/sales-report/export?type=${filterType || "daily"}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const csvFile = await res.blob();
        const url = URL.createObjectURL(csvFile);

        // Create a link and trigger download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `sales-export-${new Date().toISOString().split("T")[0]}.csv`
        );
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("تم تصدير البيانات بنجاح");
      } catch (err: unknown) {
        toast.error("حدث خطأ أثناء تصدير البيانات");
      }
    });
  return (
    <div className="w-full px-2 md:px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between flex-col gap-2 sm:flex-row  border-y py-2 mb-4">
        <h1 className="text-32 font-semibold">المبيعات</h1>
        <Button
          icon={<Share />}
          dir="ltr"
          className="rounded-lg h-10 px-6"
          onClick={exportToCsv}
        >
          تصدير
        </Button>
      </div>

      <div className="border rounded-lg ">
        {/* Table Header */}
        <div className="flex items-center gap-2 flex-col lg:flex-row-reverse justify-between p-4">
          <div className="w-full lg:w-fit flex-center flex-col sm:flex-row gap-2">
            <SortDropdown
              title="نوع الفلتر"
              onChange={setFilterType}
              align="end"
              className="w-full sm:w-fit self-start md:self-end h-10 border-black/20"
              sortOptions={FILTER_OPTIONS}
            />
            <DateRangeFilter
              className="w-full"
              defaultValue={dateRange}
              onValueChange={handleDateChange}
            />
          </div>

          <div className="w-full lg:w-1/3">
            <ProductSelect onProductSelect={setActiveProduct} />
          </div>
        </div>

        <DataTable
          table={table}
          isLoading={isLoading || isFetching}
          currentPage={1}
          pageSize={Infinity}
          totalPages={1}
          setPageSize={() => {}}
          onPageChange={() => {}}
        />
      </div>
    </div>
  );
}
