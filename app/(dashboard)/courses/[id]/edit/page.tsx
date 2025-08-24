"use client";
import { usePathname, useRouter, useParams } from "next/navigation";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import TextFormEle from "@/components/ui/form/text-form-element";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Undo2 } from "lucide-react";
import Link from "next/link";
import SelectFormEle from "@/components/ui/form/select-form-element";
import { SEMESTER_OPTIONS, YEAR_OPTIONS } from "@/constants";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  useUpdateCourseMutation,
  useGetSingleCourseQuery,
} from "@/redux/features/courses/coursesApi";
import {
  UpdateCourseFields,
  updateCourseSchema,
} from "@/schemas/courses/update-course.schema";
import { handleReqWithToaster } from "@/lib/handle-req-with-toaster";

function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = parseInt(params.id as string);
  const [outcome, setOutcome] = React.useState("");
  const [coverPreview, setCoverPreview] = React.useState<string | null>(null);

  // Fetch existing course data
  const { data: courseData, isLoading: isLoadingCourse } =
    useGetSingleCourseQuery(courseId);
  const [updateCourse, { isLoading }] = useUpdateCourseMutation();

  const form = useForm<UpdateCourseFields>({
    resolver: zodResolver(updateCourseSchema),
    defaultValues: {
      is_active: true,
    },
  });

  const learningOutcomes = (form.watch("learningOutcomes") as string[]) || [];

  // Pre-fill form with existing course data
  useEffect(() => {
    if (courseData?.data) {
      const course = courseData.data;
      form.reset({
        name: course.title,
        description: course.description,
        brief: course.brief || "",
        price: Number(course.price),
        study_year_id: course.study_year_id?.toString() || "",
        semester_id: course.semester_id?.toString() || "",
        is_active: Boolean(course.is_active),
        learningOutcomes: course.learning_outcomes || [],
      });

      // Set cover preview if exists
      if (course.image) {
        setCoverPreview(course.image);
      }
    }
  }, [courseData, form]);

  const resetForm = () => {
    if (courseData?.data) {
      const course = courseData.data;
      form.reset({
        name: course.title,
        description: course.description,
        brief: course.brief || "",
        price: Number(course.price),
        study_year_id: course.study_year_id?.toString() || "",
        semester_id: course.semester_id?.toString() || "",
        is_active: Boolean(course.is_active),
        learningOutcomes: course.learning_outcomes || [],
      });
    }
  };

  const onSubmit = (values: UpdateCourseFields) =>
    handleReqWithToaster("جاري تحديث الدورة...", async () => {
      const formData = new FormData();
      formData.append("title", values.name);
      formData.append("description", values.description);
      formData.append("brief", values.brief);
      formData.append("price", values.price.toString());
      formData.append("study_year_id", values.study_year_id);
      formData.append("semester_id", values.semester_id);
      formData.append("is_active", values.is_active ? "1" : "0");
      formData.append(
        "learning_outcomes",
        JSON.stringify(values.learningOutcomes)
      );

      // Only append image if a new one is selected
      if (values.cover) {
        formData.append("image", values.cover);
      }

      await updateCourse({ id: courseId, data: formData }).unwrap();

      toast.success("🎉 تم تحديث الدورة بنجاح!");
      router.push("/courses");
    });

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("cover", file);
      const reader = new FileReader();
      reader.onload = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addOutcome = () => {
    if (!outcome.trim()) return;
    form.setValue("learningOutcomes", [...learningOutcomes, outcome.trim()]);
    setOutcome("");
  };

  const removeOutcome = (index: number) => {
    const newOutcomes = [...learningOutcomes];
    newOutcomes.splice(index, 1);
    form.setValue("learningOutcomes", newOutcomes);
  };

  if (isLoadingCourse) {
    return (
      <div className="w-full px-2 md:px-4 lg:px-8 py-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">جاري تحميل بيانات الدورة...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-2 md:px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between flex-col gap-2 sm:flex-row mb-4">
        <h1 className="text-32 font-semibold">تعديل الدورة</h1>
        <Link href={"/courses"}>
          <Button icon={<Undo2 />} dir="ltr" className="rounded-lg h-10 px-6">
            العودة
          </Button>
        </Link>
      </div>

      <div className="bg-white/50 border p-6 rounded-xl shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center mr-auto gap-4 w-fit py-2 px-4 border rounded-xl bg-gray-50/50">
              <Label htmlFor="is_active" className="text-lg">
                مفعل
              </Label>
              <Switch
                id="is_active"
                checked={form.watch("is_active")}
                onCheckedChange={(checked) => {
                  form.setValue("is_active", checked);
                }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-full">
                <TextFormEle
                  form={form}
                  name="name"
                  label="اسم الدورة"
                  placeholder="أدخل اسم الدورة"
                />

                <TextFormEle
                  form={form}
                  name="price"
                  type="number"
                  label="سعر الدورة"
                  placeholder="سعر الدورة"
                />

                <FormField
                  control={form.control}
                  name="brief"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-sm font-medium text-black/70">
                        ملخص
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="أدخل ملخصًا موجزًا"
                          {...field}
                          rows={6}
                          className="w-full bg-gray-100/40 rounded-lg border border-gray-300 p-3"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="cover"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-medium text-black/70">
                      صورة الغلاف
                    </FormLabel>
                    <div className="flex flex-col gap-4 h-full ">
                      {coverPreview ? (
                        <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-300">
                          <img
                            src={coverPreview}
                            alt="معاينة الغلاف"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
                          <p className="text-gray-500">اختر صورة الغلاف</p>
                        </div>
                      )}
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverChange}
                          className="bg-gray-100/40 rounded-lg border border-gray-300 p-2"
                          {...fieldProps}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-medium text-black/70">
                    الوصف
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="أدخل وصفًا تفصيليًا للدورة"
                      {...field}
                      rows={6}
                      className="w-full bg-gray-100/40 rounded-lg border border-gray-300 p-3"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-6">
              <SelectFormEle
                form={form}
                name="study_year_id"
                options={YEAR_OPTIONS}
                label="السنة الدراسية"
                placeholder="السنة الدراسية"
                className="text-right"
              />

              <SelectFormEle
                form={form}
                name="semester_id"
                label="الفصل الدراسي"
                placeholder="الفصل الدراسي"
                options={SEMESTER_OPTIONS}
                className="text-right"
              />
            </div>

            <FormField
              control={form.control}
              name="learningOutcomes"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-medium text-black/70">
                    مخرجات التعلم
                  </FormLabel>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={outcome}
                        onChange={(e) => setOutcome(e.target.value)}
                        placeholder="أضف مخرج تعليمي"
                        className="flex-1 bg-gray-100/40 rounded-lg border border-gray-300 p-3 text-sm"
                      />
                      <Button
                        type="button"
                        variant={"secondary"}
                        className="rounded-lg"
                        onClick={addOutcome}
                      >
                        <Plus />
                      </Button>
                    </div>
                    <div className="space-y-2 mt-2">
                      {learningOutcomes.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-100 p-2 rounded"
                        >
                          <span>{item}</span>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeOutcome(index)}
                          >
                            حذف
                          </Button>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-start gap-3">
              <Button
                type="submit"
                className="w-full md:w-auto"
                disabled={isLoading}
              >
                {isLoading ? "جاري التحديث..." : "تحديث الدورة"}
              </Button>
              <Button
                type="button"
                onClick={resetForm}
                variant={"secondary"}
                className="w-full md:w-auto"
                disabled={isLoading}
              >
                إلغاء التغييرات
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default EditCoursePage;
