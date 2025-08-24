"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
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
import { ILesson, CreateLectureDto, UpdateLectureDto } from "@/types/course";
import TextFormEle from "../../ui/form/text-form-element";
import SelectFormEle from "../../ui/form/select-form-element";
import {
  useCreateLectureMutation,
  useUpdateLectureMutation,
} from "@/redux/features/courses/coursesApi";

// Zod schema for lesson validation
const lessonSchema = z.object({
  title: z.string().min(1, "عنوان الدرس مطلوب"),
  video_url: z.string().url("يرجى إدخال رابط صحيح"),
  external_provider: z.string().min(1, "مقدم الخدمة مطلوب"),
  is_free: z.boolean(),
});

type LessonFormValues = z.infer<typeof lessonSchema>;

interface AddLessonDialogProps {
  editingLesson?: ILesson;
  children: React.ReactNode;
  courseId: number;
  chapterId: number;
}

export function AddLessonDialog({
  editingLesson,
  children,
  courseId,
  chapterId,
}: AddLessonDialogProps) {
  const [isOpen, onOpenChange] = useState(false);
  const [createLecture, { isLoading: isCreating }] = useCreateLectureMutation();
  const [updateLecture, { isLoading: isUpdating }] = useUpdateLectureMutation();

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      video_url: "",
      external_provider: "",
      is_free: false,
    },
  });

  // Reset form when editing lesson changes
  useEffect(() => {
    if (editingLesson) {
      form.reset({
        title: editingLesson.title,
        video_url: editingLesson.video_url,
        external_provider: editingLesson.external_provider,
        is_free: Boolean(editingLesson.is_free),
      });
    } else {
      form.reset({
        title: "",
        video_url: "",
        external_provider: "",
        is_free: false,
      });
    }
  }, [editingLesson, form]);

  const handleSubmit = async (data: LessonFormValues) => {
    try {
      if (editingLesson) {
        // Update existing lecture
        const updateData: UpdateLectureDto = {
          title: data.title,
          video_url: data.video_url,
          external_provider: data.external_provider,
          is_free: data.is_free,
        };

        await updateLecture({
          courseId,
          chapterId,
          lectureId: editingLesson.id,
          data: updateData,
        }).unwrap();

        toast.success("تم تحديث الدرس بنجاح");
      } else {
        // Create new lecture
        const createData: CreateLectureDto = {
          title: data.title,
          video_url: data.video_url,
          external_provider: data.external_provider,
          is_free: data.is_free,
          course_id: courseId,
          chapter_id: chapterId,
        };

        await createLecture(createData).unwrap();
        toast.success("تم إضافة الدرس بنجاح");
      }

      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      console.error("Error saving lecture:", error);
      toast.error(
        error?.data?.message ||
          (editingLesson ? "فشل في تحديث الدرس" : "فشل في إضافة الدرس")
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
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
