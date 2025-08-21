"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/shared/DataTable";
import { columns } from "./columns";
import { useTanstackTable } from "@/hooks/use-tanstack-table";
import AddCategorySheet from "@/components/categories/AddCategorySheet";
import { useGetAllCategoriesQuery } from "@/redux/features/(waraqah)/categories/categoriesApi";
import Link from "next/link";

const SearchMechanisms = [{ label: "اسم القسم", value: "name" }];

export default function ProductsPage() {
  // States and Hooks
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Queries
  const {
    data: categories,
    isLoading,
    isFetching,
  } = useGetAllCategoriesQuery({
    page: currentPage,
    per_page: pageSize,
  });

  // Table management
  const { table } = useTanstackTable({
    columns,
    data: [
      {
        id: 1,
        title: "عنوان",
        description: "هذا نص تجريبي وليس حقيقي",
        price: "800 ج.م",
        views: 100,
        sales: 10,
        image: "/images/back-to-school-1.png",
        is_active: true,
        semester: 1,
        study_year_id: 1,
        created_at: "2023-01-01",
        updated_at: "2023-01-01",
        // New fields
        average_rating: 4.5,
        completion_rate: 85,
        instructor_name: "أحمد محمد",
        total_lessons: 24,
        total_units: 6,
        duration_hours: 48,
      },
      {
        id: 2,
        title: "كورس الرياضيات المتقدمة",
        description: "كورس شامل في الرياضيات للمرحلة الثانوية",
        price: "1200 ج.م",
        views: 250,
        sales: 35,
        image: "/images/book-1.png",
        is_active: true,
        semester: 2,
        study_year_id: 2,
        created_at: "2023-02-15",
        updated_at: "2023-03-01",
        average_rating: 4.8,
        completion_rate: 92,
        instructor_name: "فاطمة أحمد",
        total_lessons: 32,
        total_units: 8,
        duration_hours: 64,
      },
      {
        id: 3,
        title: "أساسيات الفيزياء",
        description: "مقدمة شاملة في علم الفيزياء",
        price: "950 ج.م",
        views: 180,
        sales: 22,
        image: "/images/book-2.png",
        is_active: false,
        semester: 1,
        study_year_id: 1,
        created_at: "2023-01-20",
        updated_at: "2023-02-10",
        average_rating: 4.2,
        completion_rate: 78,
        instructor_name: "محمد علي",
        total_lessons: 20,
        total_units: 5,
        duration_hours: 40,
      },
      {
        id: 4,
        title: "الكيمياء العضوية",
        description: "دراسة متعمقة للكيمياء العضوية",
        price: "1100 ج.م",
        views: 320,
        sales: 45,
        image: "/images/book-1.png",
        is_active: true,
        semester: 2,
        study_year_id: 3,
        created_at: "2023-03-05",
        updated_at: "2023-03-20",
        average_rating: 4.6,
        completion_rate: 88,
        instructor_name: "سارة حسن",
        total_lessons: 28,
        total_units: 7,
        duration_hours: 56,
      },
      {
        id: 5,
        title: "تاريخ مصر القديمة",
        description: "رحلة عبر تاريخ الحضارة المصرية القديمة",
        price: "750 ج.م",
        views: 150,
        sales: 18,
        image: "/images/book-2.png",
        is_active: true,
        semester: 1,
        study_year_id: 2,
        created_at: "2023-02-28",
        updated_at: "2023-03-15",
        average_rating: 4.3,
        completion_rate: 82,
        instructor_name: "عمر خالد",
        total_lessons: 18,
        total_units: 4,
        duration_hours: 36,
      },
    ],
    features: ["sort", "selection", "multiSelection", "filter"],
  });

  return (
    <div className="w-full px-2 md:px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between flex-col gap-2 sm:flex-row  border-y py-2 mb-4">
        <h1 className="text-32 font-semibold">الكورسات</h1>
        <Link href={"/courses/new"}>
          <Button
            icon={<PlusCircle />}
            dir="ltr"
            className="rounded-lg h-10 px-6"
          >
            انشاء كورس جديد
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg ">
        {/* Table Header */}
        <div className="flex items-center gap-4 md:gap-0 flex-col md:flex-row-reverse justify-between p-4">
          {/* <div className="flex gap-2 self-start md:self-end">
            {SearchMechanisms.length > 1 && (
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
            )}
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
          // isLoading={isLoading || isFetching}
          isLoading={false}
          currentPage={categories?.data.current_page!}
          pageSize={categories?.data.per_page!}
          totalPages={categories?.data.last_page!}
          setPageSize={(size) => setPageSize(size)}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
