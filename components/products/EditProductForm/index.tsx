"use client";

import type React from "react";

import * as z from "zod";
import { useState, useEffect } from "react";
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
import {
  useGetSingleProductQuery,
  useUpdateProductMutation,
} from "@/redux/features/products/productsApi";
import { useRouter, useSearchParams } from "next/navigation";
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
  file?: File;
  isExisting?: boolean;
}

export default function EditProductForm() {
  // Get product ID from URL query parameter
  const searchParams = useSearchParams();
  const productId = searchParams.get("product") as string;

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

  const { data: productData, isLoading: isLoadingProduct } =
    useGetSingleProductQuery(+productId, { skip: !productId });

  // Mutations
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  // Load product data when available
  useEffect(() => {
    if (productData?.data) {
      const product = productData.data;

      // Set form values
      form.reset({
        name: product.name,
        description: product.description,
        price: Number(product.price),
        price_before_discount: Number(product.price_before_discount),
        category_id: String(product.category_id),
        year: String(product.year),
        semester: String(product.semester),
        stock: Number(product.stock) || 0,
        priority: Number(product.priority) || 1,
        is_best_seller: Boolean(Number(product.is_best_seller)),
        max_quantity_per_order: product.max_quantity_per_order
          ? Number(product.max_quantity_per_order)
          : null,
        is_breakable: Boolean(Number(product.is_breakable)),
        is_active:
          product.is_active !== undefined
            ? Boolean(Number(product.is_active))
            : true,
      });

      // Set editor content
      setEditorContent(product.description || "");

      // Set product image if available
      if (product.image) {
        setImages([
          {
            id: "existing-image",
            url: product.image,
            isExisting: true,
          },
        ]);
      }
    }
  }, [productData, form]);

  // Redirect if no product ID is provided
  useEffect(() => {
    if (!productId) {
      toast.error("لم يتم تحديد المنتج");
      router.push("/dashboard/products");
    }
  }, [productId, router]);

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
    if (!productId) return toast.error("لم يتم تحديد المنتج");

    handleReqWithToaster("...جاري تحديث المنتج", async () => {
      const formData = new FormData();

      // Add all form fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (["is_best_seller", "is_breakable", "is_active"].includes(key))
          formData.append(key, value ? "1" : "0");
        else formData.append(key, `${value}`);
      });

      // Override `description`, `productType`, and `_method`
      formData.set("description", editorContent);
      formData.set("product_type", "physical");
      formData.set("_method", "PUT");

      // Add the image file if a new one was uploaded
      const newImage = images.find((img) => img.file);
      if (newImage) formData.append("image", newImage.file as File);

      // Apply the API mutation with product ID
      await updateProduct({ id: +productId, body: formData }).unwrap();
      router.push("/dashboard/products");
    });
  };

  if (isLoadingProduct) {
    return (
      <div className="p-4 flex items-center justify-center h-64">
        <div className="text-xl">جاري تحميل بيانات المنتج...</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div>
        <h1 className="mt-2 mb-6 text-32 font-semibold">تعديل المنتج</h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-4 border rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Main Information Section */}
          <div className="space-y-6">
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
              <div className="grid grid-cols-2 gap-4">
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
                  label="القسم"
                  className="col-span-2"
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
              <div className="grid grid-cols-2 gap-4 pb-4">
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
          </div>

          {/* Product Images Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-right">صور المنتج</h2>
            <div className="border rounded-lg p-4 h-80 flex items-center justify-center">
              {images.length > 0 ? (
                <div className="relative w-full h-full">
                  <img
                    src={images[selectedImage]?.url}
                    alt="Product"
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                    onClick={() =>
                      deleteImage(images[selectedImage].id, selectedImage)
                    }
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-500 mb-4">لا توجد صور للمنتج</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
                    }
                  >
                    <Plus className="mr-2" size={16} />
                    إضافة صورة
                  </Button>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className={`relative w-16 h-16 border rounded-md overflow-hidden cursor-pointer ${
                    selectedImage === index ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {images.length > 0 && (
                <div
                  className="w-16 h-16 border rounded-md flex items-center justify-center cursor-pointer bg-gray-50"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                >
                  <Plus size={20} className="text-gray-400" />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-8">
              <Button
                type="submit"
                className="w-full md:w-auto"
                disabled={isUpdating}
              >
                {isUpdating ? "جاري التحديث..." : "تحديث المنتج"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
