"use client";
import { usePathname } from "next/navigation";
import React from "react";

function Page() {
  const pathname = usePathname().split("/")[2];

  return <div>{pathname || "Home"}/</div>;
}

export default Page;
