import z from "zod";

export const updateCourseSchema = z.object({
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
    )
    .optional(), // Make image optional for updates
  description: z
    .string()
    .min(10, { message: "يجب أن يكون الوصف 10 أحرف على الأقل" }),
  brief: z.string().min(5, { message: "يجب أن يكون الملخص 5 أحرف على الأقل" }),
  learningOutcomes: z
    .array(z.string(), { message: "هذا الحقل مطلوب" })
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

export type UpdateCourseFields = z.infer<typeof updateCourseSchema>;