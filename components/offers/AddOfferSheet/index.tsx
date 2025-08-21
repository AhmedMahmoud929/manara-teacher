import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import SelectFormEle from "@/components/ui/form/select-form-element";
import TextFormEle from "@/components/ui/form/text-form-element";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { handleReqWithToaster } from "@/lib/handle-req-with-toaster";
import {
  useCreateCategoryMutation,
  useGetAllCategoriesQuery,
} from "@/redux/features/(waraqah)/categories/categoriesApi";
import { useCreateNewOfferMutation } from "@/redux/features/(waraqah)/offers/offersApi";
import { useGetAllProductsQuery } from "@/redux/features/products/productsApi";
import { CreateCategoryDto } from "@/types/(waraqah)/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeDollarSign, Box, Plus, Upload } from "lucide-react";
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const newOfferScehma = z
  .object({
    title: z.string().min(1, "العنوان مطلوب"),
    product_id: z.string().min(1, "المنتج مطلوب"),
    new_price: z
      .number({ message: "السعر الجديد مطلوب" })
      .min(1, "السعر الجديد لا يمكن ان يكون اقل من 1ج"),
    description: z.string().min(1, "الوصف مطلوب"),
    start_date: z
      .date({ message: "تاريخ البداية مطلوب" })
      .min(
        new Date(new Date().setHours(0, 0, 0, 0)),
        "تاريخ البداية يجب أن يكون اليوم أو بعده"
      ),
    end_date: z.date({ message: "تاريخ الإنتهاء مطلوب" }),
    image: z.instanceof(File).optional(),
    // parent: z.string().optional(),
  })
  .refine((data) => data.end_date > data.start_date, {
    message: "تاريخ الإنتهاء يجب أن يكون بعد تاريخ البداية",
    path: ["end_date"],
  });

type NewOfferFormFields = z.infer<typeof newOfferScehma>;

export default function AddOfferSheet({
  children,
}: {
  children: React.ReactNode;
}) {
  // States and Hooks
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get today's date formatted for min attribute
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayFormatted = today.toISOString().split("T")[0];

  // Set max date (e.g., 1 year from now)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const maxDateFormatted = maxDate.toISOString().split("T")[0];

  // Form management
  const form = useForm<NewOfferFormFields>({
    resolver: zodResolver(newOfferScehma),
    defaultValues: {
      start_date: undefined,
      end_date: undefined,
    },
  });
  const {
    formState: { errors },
    watch,
  } = form;

  // Watch start_date to set min value for end_date
  const startDate = watch("start_date");
  const minEndDate =
    startDate && startDate instanceof Date && !isNaN(startDate.getTime())
      ? new Date(startDate).toISOString().split("T")[0]
      : todayFormatted;

  // Queries
  const { data: products, isLoading: isProductsLoading } =
    useGetAllProductsQuery({ per_page: 100 });
  const chosenProduct = products?.data.data.find(
    (p) => `${p.id}` === form.watch("product_id")
  );

  // Mutations
  const [createNewOffer, { isLoading: isCreatingOffer }] =
    useCreateNewOfferMutation();

  // Functions
  const handleOnSubmit = (data: NewOfferFormFields) => {
    if (!data.image) return toast.error("صورة العرض مطلوبة");
    handleReqWithToaster("...جاري انشاء العرض", async () => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append(
        "start_date",
        data.start_date.toLocaleDateString("en-CA")
      );
      formData.append("end_date", data.end_date.toLocaleDateString("en-CA"));
      formData.append("new_price", data.new_price.toString());
      formData.append("product_id", data.product_id);
      formData.append("image", data.image!);
      await createNewOffer(formData).unwrap();

      resetSheet();
    });
  };

  const resetSheet = () => {
    setOpen(false);
    form.reset();
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side={"left"} className="w-[80vw] md:w-[60vw]">
        <div className="flex items-center gap-2 px-4 pt-4 pb-4 border-b">
          <div className="bg-gray-200 rounded-xl flex-center w-10 h-10">
            <BadgeDollarSign className="opacity-50" />
          </div>
          <span className="text-20 font-medium">عرض جديد</span>
        </div>

        <div className="h-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit)}
              className="flex flex-col justify-between overflow-y-scroll h-[87.5%]"
            >
              <div className="py-4 px-4 sm:px-6 flex flex-col md:grid md:grid-cols-2 gap-2 sm:gap-4">
                <TextFormEle
                  form={form}
                  name="title"
                  label="العنوان*"
                  placeholder="خصم 5% على كل المنتجات"
                />
                <TextFormEle
                  form={form}
                  name="description"
                  label="الوصف*"
                  placeholder="اغتنم العرض الآن"
                />

                {/* Image Upload Section */}
                <div className="col-span-2">
                  <label className="block mb-2">صورة العرض*</label>
                  <div className="flex flex-col items-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />

                    {imagePreview ? (
                      <div className="relative mb-4 w-full">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-36 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            form.setValue("image", undefined);
                          }}
                          className="absolute flex-center top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={triggerFileInput}
                        className="border-2 h-36 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 w-full mb-4"
                      >
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          اضغط لرفع صورة العرض
                        </p>
                        <p className="text-xs text-gray-400">
                          PNG, JPG, JPEG حتى 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <label htmlFor="start_date">تاريخ البدء*</label>
                  <input
                    id="start_date"
                    type="date"
                    min={todayFormatted}
                    max={maxDateFormatted}
                    className={`border rounded-lg px-4 py-1.5 bg-zinc-50 ${
                      errors.start_date ? "border-red-500" : ""
                    }`}
                    {...form.register("start_date", {
                      valueAsDate: true,
                    })}
                  />
                  {errors.start_date && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.start_date.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col space-y-1">
                  <label htmlFor="end_date">تاريخ الإنتهاء*</label>
                  <input
                    id="end_date"
                    type="date"
                    min={minEndDate}
                    max={maxDateFormatted}
                    className={`border rounded-lg px-4 py-1.5 bg-zinc-50 ${
                      errors.end_date ? "border-red-500" : ""
                    }`}
                    {...form.register("end_date", {
                      valueAsDate: true,
                    })}
                  />
                  {errors.end_date && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.end_date.message}
                    </p>
                  )}
                </div>

                <SelectFormEle
                  options={
                    products?.data.data.map(({ id, name }) => ({
                      label: name,
                      value: `${id}`,
                    })) || []
                  }
                  form={form}
                  name="product_id"
                  label={`المنتج* ${
                    chosenProduct ? `(${chosenProduct.price} ج)` : ""
                  }`}
                  placeholder={
                    isProductsLoading ? "جاري التحميل ..." : "اختر المنتج"
                  }
                  disabled={isProductsLoading}
                />
                <TextFormEle
                  form={form}
                  name="new_price"
                  label="السعر بعد الخصم*"
                  type="number"
                  placeholder="100"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row px-4 border-t pt-4 items-center justify-end gap-2">
                <Button
                  variant={"outline"}
                  onClick={resetSheet}
                  type="button"
                  disabled={isCreatingOffer}
                  className="rounded-lg border-black/20 !text-black/60 hover:!text-black/80 w-full sm:w-fit"
                >
                  تجاهل
                </Button>
                <Button
                  icon={<Plus />}
                  disabled={isCreatingOffer}
                  className="rounded-lg w-full sm:w-40"
                >
                  اضف العرض
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
