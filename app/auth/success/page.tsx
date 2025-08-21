import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import React from "react";

function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <div className="bg-primary rounded-full flex-center p-4">
        <Check size={64} className="text-white" />
      </div>
      <h1 className="text-36 font-semibold mt-4">تم انشاء حسابك بنجاح!</h1>
      <p className="text-20">ابدأ بالتسوق الان مع ورقة ستور</p>

      <Link href="/" className="mt-8">
        <Button className="rounded-lg min-w-32">إبدأ</Button>
      </Link>
    </div>
  );
}

export default SuccessPage;
