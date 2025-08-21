"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IUnit } from "@/types/course";
import TextFormEle from "../ui/form/text-form-element";

// Zod schema for unit validation
const unitSchema = z.object({
  title: z
    .string()
    .min(1, "اسم الوحدة مطلوب")
    .min(3, "اسم الوحدة يجب أن يكون 3 أحرف على الأقل")
    .max(100, "اسم الوحدة يجب أن يكون أقل من 100 حرف"),
  description: z
    .string()
    .max(500, "وصف الوحدة يجب أن يكون أقل من 500 حرف")
    .optional()
    .or(z.literal("")),
});

type UnitFormValues = z.infer<typeof unitSchema>;

interface AddEditUnitDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingUnit: IUnit | null;
  onSave: (data: UnitFormValues) => void;
}

export function AddEditUnitDialog({
  isOpen,
  onOpenChange,
  editingUnit,
  onSave,
}: AddEditUnitDialogProps) {
  const form = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Reset form when dialog opens/closes or when editing unit changes
  useEffect(() => {
    if (isOpen) {
      if (editingUnit) {
        form.reset({
          title: editingUnit.title,
          description: editingUnit.description || "",
        });
      } else {
        form.reset({
          title: "",
          description: "",
        });
      }
    }
  }, [isOpen, editingUnit, form]);

  const handleSubmit = (data: UnitFormValues) => {
    onSave(data);
    onOpenChange(false);
    form.reset();
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-3xl text-start">
            {editingUnit ? "تعديل الوحدة" : "إضافة وحدة جديدة"}
          </DialogTitle>
          <DialogDescription className="text-start">
            {editingUnit
              ? "قم بتعديل بيانات الوحدة أدناه"
              : "أدخل بيانات الوحدة الجديدة أدناه"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid gap-4 py-4">
              <TextFormEle
                form={form}
                name="title"
                label="اسم الوحدة *"
                placeholder="أدخل اسم الوحدة"
              />

              <TextFormEle
                form={form}
                type="textarea"
                name="description"
                label="وصف الوحدة"
                placeholder="أدخل وصف الوحدة (اختياري)"
              />
            </div>

            <DialogFooter className="gap-2">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "جاري الحفظ..."
                  : editingUnit
                  ? "حفظ التغييرات"
                  : "إضافة الوحدة"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                إلغاء
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
