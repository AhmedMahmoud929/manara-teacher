"use client";

import type React from "react";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import TiptapEditor from "../tiptap-editor";
import { Form } from "@/components/ui/form";
import TextFormEle from "@/components/ui/form/text-form-element";
import SelectFormEle from "@/components/ui/form/select-form-element";
import { useGetAllCategoriesQuery } from "@/redux/features/(waraqah)/categories/categoriesApi";
import { toast } from "sonner";
import { handleReqWithToaster } from "@/lib/handle-req-with-toaster";
import { useCreateNewProductMutation } from "@/redux/features/products/productsApi";
import { useRouter } from "next/navigation";
import { YEAR_OPTIONS } from "@/constants";

// Define the form schema with Zod
const productSchema = z.object({
  name: z.string().min(1, "اسم المنتج مطلوب"),
  description: z.string().nullable(),
  price: z.number().min(1, "السعر مطلوب"),
  price_before_discount: z
    .number()
    .min(0, "السعر قبل الخصم لا يمكن ان يكون اقل من 0"),
  category_id: z.string().min(1, "الفئة مطلوبة"),
  year: z.string().min(1, "السنة مطلوبة"),
  semester: z.string().min(1, "الفصل الدراسي مطلوب"),
  stock: z.number().nonnegative("المخزون يجب أن يكون 0 أو أكثر"),
  priority: z.number().min(1, "الأولوية يجب أن تكون 1 أو أكثر"),
  is_best_seller: z.boolean(),
  max_quantity_per_order: z
    .number()
    .min(0, "الحد الأقصى للطلب لا يمكن ان يكون اقل من 0")
    .nullable(),
  is_breakable: z.boolean(),
  is_active: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface FileWithPreview {
  id: string;
  url: string;
  file: File;
}

export default function ProductForm() {
  // Hooks
  const [images, setImages] = useState<FileWithPreview[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [editorContent, setEditorContent] = useState("");
  const MAX_LETTER_LENGTH = 3500;
  const router = useRouter();

  // Form Management
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: null,
      price: 100,
      price_before_discount: 0,
      year: "10",
      semester: "1",
      stock: 0,
      priority: 1,
      is_best_seller: false,
      max_quantity_per_order: null,
      is_breakable: false,
      is_active: true,
    },
  });
  const description = form.watch("description");

  // Queries
  const { data: categories, isLoading: isLoadingCategories } =
    useGetAllCategoriesQuery({ per_page: 100 });

  // Mutations
  const [createNewProduct] = useCreateNewProductMutation();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      const newImage = { id: Date.now().toString(), url: imageUrl, file };
      setImages([...images, newImage]);
      setSelectedImage(images.length);
    }
  };

  const deleteImage = (id: string, index: number) => {
    const newImages = images.filter((img) => img.id !== id);
    setImages(newImages);

    // Adjust selected image index if needed
    if (selectedImage === index) {
      setSelectedImage(Math.min(0, newImages.length - 1));
    } else if (selectedImage > index) {
      setSelectedImage(selectedImage - 1);
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    // Include the rich text editor content
    if (!images.length) return toast.error("يرجى اضافة صورة واحدة على الاقل");

    handleReqWithToaster("...جاري إضافة المنتج", async () => {
      const formData = new FormData();

      // Add all form fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (["is_best_seller", "is_breakable", "is_active"].includes(key))
          formData.append(key, value ? "1" : "0");
        else if (key === "max_quantity_per_order")
          formData.append(key, `${value || null}`);
        else formData.append(key, `${value}`);
      });

      // Override description and productType with rich text content
      formData.set("description", editorContent);
      formData.set("product_type", "physical");

      // Add the image file
      if (images.length > 0) formData.append("image", images[0].file);

      // Apply the API mutation
      await createNewProduct(formData).unwrap();
      form.reset();
      setEditorContent("");
      setImages([]);
      router.push("/dashboard/products");
    });
  };

  return (
    <div className="sm:p-4">
      <div>
        <h1 className="mt-2 mb-6 text-32 font-semibold">إضافة منتج جديد</h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-4 border rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Main Information Section */}
          <div className="order-2 md:order-1 space-y-6">
            <h2 className="text-xl font-semibold text-right">
              المعلومات الرئيسية
            </h2>
            <div className="space-y-4">
              <div>
                <TextFormEle
                  form={form}
                  name="name"
                  label="اسم المنتج"
                  placeholder="اسم المنتج"
                  className="text-right"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label
                    htmlFor="description"
                    className="text-right w-full text-sm font-medium"
                  >
                    الوصف
                  </label>
                </div>
                <TiptapEditor
                  value={editorContent}
                  onChange={(content) => {
                    setEditorContent(content);
                    form.setValue("description", content);
                  }}
                />
              </div>

              <div className="text-right text-sm text-gray-500">
                {MAX_LETTER_LENGTH - (description?.length || 0)} حرف
              </div>
            </div>

            {/* Academic Information */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-right mb-4">
                المعلومات الأساسية
              </h2>
              <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
                <TextFormEle
                  form={form}
                  name="price"
                  type="number"
                  label="السعر"
                  className="text-right"
                />
                <TextFormEle
                  form={form}
                  name="price_before_discount"
                  type="number"
                  label="السعر قبل الخصم"
                  className="text-right"
                />

                <SelectFormEle
                  form={form}
                  name="category_id"
                  options={
                    categories?.data.data.map((cat) => ({
                      label: cat.name,
                      value: `${cat.id}`,
                    })) || []
                  }
                  className="col-span-2"
                  label="القسم"
                  disabled={isLoadingCategories}
                  placeholder={
                    isLoadingCategories
                      ? "جاري التحميل..."
                      : "يرجى اختيار القسم"
                  }
                />

                <SelectFormEle
                  form={form}
                  name="year"
                  options={YEAR_OPTIONS}
                  label="السنة الدراسية"
                  className="text-right"
                />
                <SelectFormEle
                  form={form}
                  name="semester"
                  label="الفصل الدراسي"
                  options={[
                    { label: "الفصل الدراسي الأول", value: "1" },
                    { label: "الفصل الدراسي الثاني", value: "2" },
                  ]}
                  className="text-right"
                />
              </div>
            </div>

            {/* Inventory Information */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-right mb-4">
                معلومات المخزون
              </h2>
              <TextFormEle
                form={form}
                name="stock"
                type="number"
                label="المخزون الكلي"
                className="text-right"
              />
            </div>

            {/* Product Settings */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-right mb-4">
                إعدادات المنتج
              </h2>
              <div className="grid md:grid-cols-2 gap-4 pb-4">
                <TextFormEle
                  form={form}
                  name="priority"
                  type="number"
                  label="الأولوية"
                  className="text-right"
                />
                <TextFormEle
                  form={form}
                  name="max_quantity_per_order"
                  type="number"
                  label="الحد الأقصى للطلب"
                  placeholder=""
                  className="text-right"
                />
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                <div className="flex items-center justify-start gap-4 space-x-2 rtl:space-x-reverse">
                  <Label htmlFor="is_active" className="text-right">
                    نشط
                  </Label>
                  <Switch
                    id="is_active"
                    dir="ltr"
                    checked={form.watch("is_active")}
                    onCheckedChange={(checked) => {
                      form.setValue("is_active", checked);
                    }}
                  />
                </div>
                <div className="flex items-center justify-start gap-4 space-x-2 rtl:space-x-reverse">
                  <Label htmlFor="is_best_seller" className="text-right">
                    الأكثر مبيعاً
                  </Label>
                  <Switch
                    id="is_best_seller"
                    dir="ltr"
                    checked={form.watch("is_best_seller")}
                    onCheckedChange={(checked) => {
                      form.setValue("is_best_seller", checked);
                    }}
                  />
                </div>
                <div className="flex items-center justify-start gap-4 space-x-2 rtl:space-x-reverse">
                  <Label htmlFor="is_breakable" className="text-right">
                    قابل للكسر
                  </Label>
                  <Switch
                    id="is_breakable"
                    dir="ltr"
                    checked={form.watch("is_breakable")}
                    onCheckedChange={(checked) => {
                      form.setValue("is_breakable", checked);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-12">
              <Button type="submit" className="rounded-lg w-full">
                حفظ المنتج
              </Button>
            </div>
          </div>

          {/* Product Images Section */}
          <div className="order-1 md:order-2 space-y-6">
            <h2 className="text-xl font-semibold text-right">صور المنتج</h2>
            <div className="border rounded-lg p-4">
              <div className="w-full bg-gray-100 rounded-lg overflow-hidden mb-4 h-80 relative">
                {images.length > 0 ? (
                  <>
                    <img
                      src={images[selectedImage]?.url || "/placeholder.svg"}
                      alt="Product"
                      className="w-full h-full object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0"
                      onClick={() =>
                        deleteImage(images[selectedImage].id, selectedImage)
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-gray-400 mb-2">لا توجد صور</div>
                    <label
                      className="relative cursor-pointer"
                      htmlFor="imageFileInp"
                    >
                      <Button type="button" variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" /> إضافة صورة
                      </Button>
                      <input
                        id="imageFileInp"
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleImageUpload}
                        accept="image/*"
                      />
                    </label>
                  </div>
                )}
              </div>
              {/* TODO: Change that to `flex` later instead of `hidden` */}
              <div className="hidden _flex_ flex-wrap items-center gap-2">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    className={`w-16 h-16 border rounded-lg overflow-hidden cursor-pointer relative ${
                      selectedImage === index ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <label className="w-16 h-16 border rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
                  <Plus className="w-6 h-6 text-gray-400" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </label>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
