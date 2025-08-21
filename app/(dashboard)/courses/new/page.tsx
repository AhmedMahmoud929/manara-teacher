"use client";
import { usePathname } from "next/navigation";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import CounterFormEle from "@/components/ui/form/counter-form-element";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Image from "next/image";
import { Plus, Undo2 } from "lucide-react";
import Link from "next/link";
import SelectFormEle from "@/components/ui/form/select-form-element";
import { SEMESTER_OPTIONS, YEAR_OPTIONS } from "@/constants";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// تعريف مخطط النموذج باستخدام zod
const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "يجب أن يكون اسم الدورة 3 أحرف على الأقل" }),
  cover: z
    .instanceof(File, { message: "صورة الغلاف مطلوبة" })
    .refine((file) => file.size <= 5000000, {
      message: "يجب أن يكون حجم الملف أقل من 5 ميجابايت",
    })
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        ),
      { message: "يجب أن تكون الصورة بتنسيق JPEG أو PNG أو WebP" }
    ),
  description: z
    .string()
    .min(10, { message: "يجب أن يكون الوصف 10 أحرف على الأقل" }),
  brief: z.string().min(5, { message: "يجب أن يكون الملخص 5 أحرف على الأقل" }),
  learningOutcomes: z
    .array(z.string())
    .min(1, { message: "مطلوب نتيجة تعليمية واحدة على الأقل" }),
  price: z.coerce
    .number()
    .min(0, { message: "يجب أن يكون السعر رقمًا موجبًا" }),
  is_active: z.boolean(),
  study_year_id: z.string({
    required_error: "السنة الدراسية مطلوبة",
  }),
  semester_id: z.string({
    required_error: "الترم الدراسي مطلوبة",
  }),
});

type FormValues = z.infer<typeof formSchema>;

function NewCoursePage() {
  const pathname = usePathname();
  const [outcome, setOutcome] = React.useState("");
  const [coverPreview, setCoverPreview] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      is_active: true,
    },
  });

  const learningOutcomes = (form.watch("learningOutcomes") as string[]) || [];

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

  const onSubmit = (values: FormValues) => {
    console.log(values);
    toast.success("تم إنشاء الدورة بنجاح!");
  };

  const resetForm = () => form.reset();

  return (
    <div className="w-full px-2 md:px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between flex-col gap-2 sm:flex-row mb-4">
        <h1 className="text-32 font-semibold">إنشاء دورة جديدة</h1>
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
              <Button type="submit" className="w-full md:w-auto">
                إنشاء الدورة
              </Button>
              <Button
                type="button"
                onClick={resetForm}
                variant={"secondary"}
                className="w-full md:w-auto"
              >
                إلغاء
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default NewCoursePage;
