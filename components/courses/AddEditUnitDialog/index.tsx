"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useGetSingleUnitQuery,
} from "@/redux/features/courses/coursesApi";
import {
  createUnitSchema,
  CreateUnitFormData,
} from "@/schemas/units/create-unit.schema";
import {
  updateUnitSchema,
  UpdateUnitFormData,
} from "@/schemas/units/update-unit.schema";
import { IUnit } from "@/types/course";
import { handleReqWithToaster } from "@/lib/handle-req-with-toaster";
import TextFormEle from "@/components/ui/form/text-form-element";

interface AddEditUnitDialogProps {
  children: React.ReactNode;
  courseId: number;
  unitId?: number;
}

export default function AddEditUnitDialog({
  children,
  courseId,
  unitId,
}: AddEditUnitDialogProps) {
  const [open, setOpen] = useState(false);
  const [createUnit, { isLoading: isCreating }] = useCreateUnitMutation();
  const [updateUnit, { isLoading: isUpdating }] = useUpdateUnitMutation();

  const { data: unitData, isLoading: isLoadingUnit } = useGetSingleUnitQuery(
    { courseId, unitId: unitId! },
    { skip: !unitId }
  );

  const isEdit = !!unitId;
  const schema = isEdit ? updateUnitSchema : createUnitSchema;

  const form = useForm<CreateUnitFormData | UpdateUnitFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      order: 1,
      is_active: true,
    },
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (isEdit && unitData?.data) {
      const unit = unitData.data;
      form.reset({
        title: unit.title,
        description: "",
        order: unit.order,
        is_active: false,
      });
    }
  }, [unitData, isEdit, form]);

  const onSubmit = async (data: CreateUnitFormData | UpdateUnitFormData) => {
    const isEditMode = isEdit && unitId;

    handleReqWithToaster(
      isEditMode ? "جاري تحديث الوحدة..." : "جاري إنشاء الوحدة...",
      async () => {
        if (isEditMode)
          await updateUnit({
            courseId,
            unitId,
            data: data as UpdateUnitFormData,
          } as any).unwrap();
        else await createUnit({ ...data, course_id: courseId } as any).unwrap();
        handleClose(false);
      }
    );
  };

  const handleClose = (open: boolean) => {
    setOpen(open);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-3xl text-start">
            {isEdit ? "تعديل الوحدة" : "إضافة وحدة جديدة"}
          </DialogTitle>
          <DialogDescription className="text-start">
            {isEdit
              ? "قم بتعديل بيانات الوحدة أدناه"
              : "أدخل بيانات الوحدة الجديدة أدناه"}
          </DialogDescription>
        </DialogHeader>

        {isLoadingUnit ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="mr-2">جاري تحميل بيانات الوحدة...</span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <TextFormEle
                form={form}
                name="title"
                label="عنوان الوحدة"
                placeholder="أدخل عنوان الوحدة"
                disabled={isCreating || isUpdating}
              />

              <TextFormEle
                form={form}
                label="الوصف *"
                placeholder="أدخل وصف الوحدة"
                type="textarea"
                name="description"
                disabled={isCreating || isUpdating}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">حالة النشاط</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        تفعيل أو إلغاء تفعيل هذه الوحدة
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isCreating || isUpdating}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2">
                <Button type="submit" disabled={isCreating || isUpdating}>
                  {isCreating || isUpdating ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      {isEdit ? "جاري التحديث..." : "جاري الإنشاء..."}
                    </>
                  ) : (
                    <>{isEdit ? "تحديث الوحدة" : "إنشاء الوحدة"}</>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleClose(false)}
                  disabled={isCreating || isUpdating}
                >
                  إلغاء
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
