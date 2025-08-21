"use client";

import React, { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ILesson } from "@/types/course";
import TextFormEle from "../ui/form/text-form-element";
import SelectFormEle from "../ui/form/select-form-element";

// Zod schema for lesson validation
const lessonSchema = z.object({});

type LessonFormValues = z.infer<typeof lessonSchema>;

interface AddLessonDialogProps {
  editingLesson?: ILesson;
  children: React.ReactNode;
}

export function AddLessonDialog({
  editingLesson,
  children,
}: AddLessonDialogProps) {
  const [isOpen, onOpenChange] = useState(false);
  const form = useForm();

  const handleSubmit = (data: LessonFormValues) => {
    onOpenChange(false);
    form.reset();
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-3xl text-start">
            {editingLesson ? "تعديل الدرس" : "إضافة درس جديد"}
          </DialogTitle>
          <DialogDescription className="text-start">
            {editingLesson
              ? "قم بتعديل بيانات الدرس أدناه"
              : "أدخل بيانات الدرس الجديد أدناه"}
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
                placeholder="يرجى كتابة عنوان الدرس هنا"
                label="عنوان الدرس *"
              />

              <div className="grid grid-cols-2 gap-4">
                <TextFormEle
                  form={form}
                  name="video_url"
                  placeholder="https://example.com/videos/algebra-intro.mp4"
                  label="رابط الفيديو *"
                />

                <SelectFormEle
                  form={form}
                  name="external_provider"
                  placeholder="اختر مقدم الخدمة"
                  label="مقدم الخدمة *"
                  options={[
                    { label: "Vimeo", value: "vimeo" },
                    { label: "YouTube", value: "youtube" },
                    { label: "Dailymotion", value: "dailymotion" },
                    { label: "Wistia", value: "wistia" },
                    { label: "أخرى", value: "other" },
                  ]}
                />
              </div>

              <FormField
                control={form.control}
                name="is_free"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">درس مجاني</FormLabel>
                      <FormDescription>
                        هل هذا الدرس متاح مجاناً للطلاب؟
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
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "جاري الحفظ..."
                  : editingLesson
                  ? "حفظ التغييرات"
                  : "إضافة الدرس"}
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
