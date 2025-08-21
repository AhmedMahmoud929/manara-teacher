import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Logo({ className }: { className?: string }) {
  return (
    <Link
      href={"/"}
      className={cn("flex items-center justify-center gap-2", className)}
    >
      <Image
        src="/svgs/badge-check.svg"
        alt="Lighthouse Logo"
        width={35}
        height={35}
      />
      <span className="text-2xl font-semibold mb-0.5">منصة منارة</span>
    </Link>
  );
}

export default Logo;
