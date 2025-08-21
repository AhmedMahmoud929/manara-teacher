"use client";

import { useState } from "react";
import { PlusCircle, Share } from "lucide-react";

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
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import {
  useExportOrdersCSVQuery,
  useGetAllOrdersQuery,
  useGetOrdersByUserQuery,
} from "@/redux/features/(waraqah)/orders/ordersApi";
import { useSearchParams } from "next/navigation";
import { fetchData } from "@/lib/fetch-data";
import { API_URL } from "@/constants/env";
import { toast } from "sonner";
import { handleReqWithToaster } from "@/lib/handle-req-with-toaster";

const SearchMechanisms = [{ label: "اسم القسم", value: "name" }];

// pending,confirmed,shipped,cancelled
const PAYMENT_STATUS_OPTIONS = [
  { label: "الكل", value: "" },
  { label: "لم يتم الدفع", value: "pending" },
  { label: "تم الدفع", value: "paid" },
  { label: "انتهت صلاحية الدفع", value: "expired" },
];

const ORDER_STATUS_OPTIONS = [
  { label: "الكل", value: "" },
  { label: "قيد الانتظار", value: "pending" },
  { label: "تم التأكيد", value: "confirmed" },
  { label: "تم الشحن", value: "shipped" },
  { label: "تم الإلغاء", value: "cancelled" },
];

export default function OrdersPage() {
  // States and Hooks
  const [orderStatus, setOrderStatus] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const user_id = useSearchParams().get("user") as string;
  const { token } = useAppSelector((state) => state.auth);

  // Queries
  const {
    data: orders,
    isLoading,
    isFetching,
  } = useGetAllOrdersQuery(
    {
      page: currentPage,
      per_page: pageSize,
      invoice_status: paymentStatus,
      order_status: orderStatus,
    },
    { skip: !!user_id, refetchOnMountOrArgChange: true }
  );

  const {
    data: userOrders,
    isLoading: isUserOrdersLoading,
    isFetching: isUserOrdersFetching,
  } = useGetOrdersByUserQuery(
    {
      page: currentPage,
      per_page: pageSize,
      invoice_status: paymentStatus,
      order_status: orderStatus,
      user_id: user_id,
    },
    {
      skip: !user_id,
      refetchOnMountOrArgChange: true,
    }
  );

  const isLoadingCondition =
    isLoading || isUserOrdersLoading || isFetching || isUserOrdersFetching;
  const currentPageRes = (orders?.data.current_page ||
    userOrders?.data.current_page) as number;
  const perPageRes = (orders?.data.per_page ||
    userOrders?.data.per_page) as number;
  const totalPagesRes = (orders?.data.last_page ||
    userOrders?.data.last_page) as number;

  // Table management
  const { table } = useTanstackTable({
    columns,
    data: userOrders?.data.data || orders?.data.data || [],
    features: ["sort", "selection", "multiSelection"],
  });

  // Functions
  const exportToCsv = () =>
    handleReqWithToaster("جاري تصدير البيانات...", async () => {
      try {
        const res = await fetch(
          `${API_URL}admin/orders/export?invoice_status=${paymentStatus}&order_status=${orderStatus}`,
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
          `orders-export-${new Date().toISOString().split("T")[0]}.csv`
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
        <h1 className="text-32 font-semibold">
          {user_id ? `أوردرات: ` : "الأوردرات"}
          <span className="opacity-80">
            {userOrders?.data.data[0]?.user.name}
          </span>
        </h1>
      </div>

      <div className="border rounded-lg ">
        {/* Table Header */}
        <div className="flex items-center gap-4 md:gap-0 flex-col md:flex-row-reverse justify-between p-4">
          {user_id ? null : (
            <Button
              icon={<Share />}
              dir="ltr"
              className="rounded-lg h-10 px-6"
              onClick={exportToCsv}
            >
              تصدير
            </Button>
          )}

          <div className="flex-center gap-2">
            <SortDropdown
              title="حالة الطلب"
              onChange={setOrderStatus}
              align="end"
              className="self-start md:self-end"
              sortOptions={ORDER_STATUS_OPTIONS}
            />
            <SortDropdown
              title="حالة الدفع"
              onChange={setPaymentStatus}
              align="end"
              className="self-start md:self-end"
              sortOptions={PAYMENT_STATUS_OPTIONS}
            />
          </div>
        </div>

        <DataTable
          table={table}
          isLoading={isLoadingCondition}
          currentPage={currentPageRes}
          pageSize={perPageRes}
          totalPages={totalPagesRes}
          setPageSize={(size) => setPageSize(size)}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
