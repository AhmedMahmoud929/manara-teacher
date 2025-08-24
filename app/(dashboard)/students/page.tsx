"use client";
import { usePathname } from "next/navigation";
import React from "react";

function Page() {
  const pathname = usePathname().split("/")[1];
  return (
    <div className="mx-auto text-center p-4 bg-gray-100 rounded-2xl uppercase">
      {pathname}
    </div>
  );
}

export default Page;
