"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationDialogProps {
  name: string;
  onDelete: () => void;
  children: React.ReactNode;
}

export function DeleteConfirmationDialog({
  name,
  onDelete,
  children,
}: DeleteConfirmationDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleConfirm = () => {
    onDelete();
    setIsOpen(false);
  };

  const handleCancel = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="p-0 gap-0 border-0 max-w-md overflow-hidden"
        dir="rtl"
      >
        <div className="flex justify-between items-start p-4">
          <div className="relative w-[70px] h-[70px] flex items-center justify-center">
            <div className="absolute w-[110px] h-[110px] rounded-full bg-red-50/50 opacity-30"></div>
            <div className="absolute w-[90px] h-[90px] rounded-full bg-red-50 opacity-60"></div>
            <div className="absolute w-[70px] h-[70px] rounded-full bg-red-100"></div>
            <div className="absolute w-[50px] h-[50px] rounded-full bg-red-200 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>

        <div className="px-6 pb-4 text-right">
          <DialogTitle className="text-2xl font-bold mb-2 mt-4">
            حذف {name}؟
          </DialogTitle>
          <p className="text-gray-600 mb-6">
            هل انت متأكد من حذف هذا{name}؟ لن تتمكن من التراجع من هذه الخطوة
          </p>

          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              className="flex-1 py-6 text-lg rounded-lg font-medium !text-black border-black"
              onClick={handleCancel}
            >
              تجاهل
            </Button>
            <Button
              variant="destructive"
              className="flex-1 py-6 text-lg rounded-lg font-medium bg-main-red hover:bg-main-red/70 text-white"
              onClick={handleConfirm}
            >
              حذف
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
