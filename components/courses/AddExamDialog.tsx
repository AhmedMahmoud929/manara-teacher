"use client";

import React, { useState } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IExam } from "@/types/course";
import TextFormEle from "../ui/form/text-form-element";
import {
  useCreateExamMutation,
  useUpdateExamMutation,
} from "@/redux/features/exams/examsApi";
import { toast } from "sonner";

// Zod schema for exam validation
const examSchema = z.object({
  title: z.string().min(1, "عنوان الامتحان مطلوب"),
  can_resume: z.boolean(),
  show_answers_after_finish: z.boolean(),
  start_date: z.string().min(1, "تاريخ البدء مطلوب"),
  end_date: z.string().min(1, "تاريخ الانتهاء مطلوب"),
});

type ExamFormValues = z.infer<typeof examSchema>;

interface AddExamDialogProps {
  editingExam?: IExam;
  children: React.ReactNode;
  courseId: number;
  chapterId: number;
}

export function AddExamDialog({
  editingExam,
  children,
  courseId,
  chapterId,
}: AddExamDialogProps) {
  const [isOpen, onOpenChange] = useState(false);
  const [createExam, { isLoading: isCreating }] = useCreateExamMutation();
  const [updateExam, { isLoading: isUpdating }] = useUpdateExamMutation();

  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: editingExam?.title || "",
      can_resume: editingExam ? true : true, // Default from your example
      show_answers_after_finish: editingExam ? false : false, // Default from your example
      start_date: editingExam ? "" : "", // Format: "2025-08-13T09:00"
      end_date: editingExam ? "" : "", // Format: "2025-08-15T23:59"
    },
  });

  const handleSubmit = async (data: ExamFormValues) => {
    try {
      if (editingExam) {
        // Update existing exam
        await updateExam({
          courseId,
          chapterId,
          examId: editingExam.id,
          data,
        }).unwrap();
        toast.success("تم تحديث الامتحان بنجاح");
      } else {
        // Create new exam
        await createExam({
          ...data,
          course_id: courseId,
          chapter_id: chapterId,
        }).unwrap();
        toast.success("تم إضافة الامتحان بنجاح");
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error(
        editingExam ? "فشل في تحديث الامتحان" : "فشل في إضافة الامتحان"
      );
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.reset();
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <div>{children}</div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-3xl text-start">
            {editingExam ? "تعديل الامتحان" : "إضافة امتحان جديد"}
          </DialogTitle>
          <DialogDescription className="text-start">
            {editingExam
              ? "قم بتعديل بيانات الامتحان أدناه"
              : "أدخل بيانات الامتحان الجديد أدناه"}
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
                placeholder="يرجى كتابة عنوان الامتحان هنا"
                label="عنوان الامتحان *"
              />

              <div className="grid grid-cols-2 gap-4">
                <TextFormEle
                  form={form}
                  name="start_date"
                  type="datetime-local"
                  label="تاريخ ووقت البدء *"
                />

                <TextFormEle
                  form={form}
                  name="end_date"
                  type="datetime-local"
                  label="تاريخ ووقت الانتهاء *"
                />
              </div>

              <FormField
                control={form.control}
                name="can_resume"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        إمكانية الاستكمال
                      </FormLabel>
                      <FormDescription>
                        هل يمكن للطلاب استكمال الامتحان لاحقاً؟
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="show_answers_after_finish"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        إظهار الإجابات بعد الانتهاء
                      </FormLabel>
                      <FormDescription>
                        هل تريد إظهار الإجابات الصحيحة للطلاب بعد انتهاء
                        الامتحان؟
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "جاري الحفظ..."
                  : editingExam
                  ? "حفظ التغييرات"
                  : "إضافة الامتحان"}
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
