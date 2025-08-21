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
import AddCouponSheet from "@/components/coupons/AddCouponSheet";
import { useGetAllCouponsQuery } from "@/redux/features/(waraqah)/coupons/couponsApi";

const SearchMechanisms = [{ label: "الكود", value: "code" }];

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
    data: coupons,
    isLoading,
    isFetching,
  } = useGetAllCouponsQuery({
    page: currentPage,
    per_page: pageSize,
  });

  console.log(coupons);

  // Table management
  const { table, setSorting, getSearchVal, setSearchVal } = useTanstackTable({
    columns,
    data: coupons?.data.data || [],
    features: ["sort", "selection", "multiSelection", "filter"],
  });

  // Functions
  const handleSortChange = (value: string) => {
    switch (value) {
      case "newest":
        setSorting([{ id: "created_at", desc: true }]);
        break;
      case "oldest":
        setSorting([{ id: "created_at", desc: false }]);
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full px-2 md:px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between flex-col gap-2 sm:flex-row  border-y py-2 mb-4">
        <h1 className="text-32 font-semibold">الإشتراكات</h1>
        {/* <AddCouponSheet>
          <Button
            icon={<PlusCircle />}
            dir="ltr"
            className="rounded-lg h-10 px-6"
          >
            اضف كوبون جديد
          </Button>
        </AddCouponSheet> */}
      </div>
      <div className="border rounded-lg ">
        {/* Table Header */}
        <div className="flex items-center gap-4 md:gap-0 flex-col md:flex-row-reverse justify-between p-4">
          <div className="flex gap-2 self-start md:self-end">
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
          </div>

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
          currentPage={coupons?.data.current_page!}
          pageSize={coupons?.data.per_page!}
          totalPages={coupons?.data.last_page!}
          setPageSize={(size) => setPageSize(size)}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
