"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SortDropdown } from "@/components/shared/SortDropdown";
import DataTable from "@/components/shared/DataTable";
import { columns } from "./columns";
import { useTanstackTable } from "@/hooks/use-tanstack-table";
import { useGetAllOffersQuery } from "@/redux/features/(waraqah)/offers/offersApi";
import AddOfferSheet from "@/components/offers/AddOfferSheet";

const SearchMechanisms = [
  { label: "اسم العميل", value: "id" },
  { label: "البريد الإلكتروني", value: "email" },
  { label: "رقم الهاتف", value: "phone" },
  { label: "رقم الهاتف البديل", value: "altPhone" },
];

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
    data: offers,
    isLoading,
    isFetching,
  } = useGetAllOffersQuery({
    page: currentPage,
    per_page: pageSize,
  });

  // Table management
  const { table, setSorting, getSearchVal, setSearchVal } = useTanstackTable({
    columns,
    data: offers?.data.data || [],
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
        <h1 className="text-32 font-semibold">العروض</h1>
        <AddOfferSheet>
          <Button
            icon={<PlusCircle />}
            dir="ltr"
            className="rounded-lg h-10 px-6"
          >
            اضف عرض جديد
          </Button>
        </AddOfferSheet>
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
          currentPage={offers?.data.current_page!}
          pageSize={offers?.data.per_page!}
          totalPages={offers?.data.last_page!}
          setPageSize={(size) => setPageSize(size)}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
