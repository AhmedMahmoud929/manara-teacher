"use client";

import React from "react";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import { BreadcrumHeader } from "@/components/shared/BreadcrumHeader";

function DashboardHeader() {
  const pathname = usePathname().split("/")[2];
  const ROUTES_MAP: Record<string, string> = {
    products: "المنتجات",
    customers: "العملاء",
    categories: "الأقسام",
    orders: "الطلبات",
  };
  return (
    <div className="flex justify-between items-start pr-12 pb-4 md:p-4 md:pb-2">
      <BreadcrumHeader
        className="mt-3 md:m-0"
        headTitle={false}
        title={ROUTES_MAP[pathname]}
        breadcrumbs={[{ label: "الرئيسية", href: "/dashboard" }]}
      />
      <button className="group rounded-xl border border-black/20 hover:border-black/40 duration-300 flex-center h-10 w-10">
        <Bell
          size={20}
          className="duration-300 text-black/40 group-hover:text-black/60"
        />
      </button>
    </div>
  );
}

export default DashboardHeader;
