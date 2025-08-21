import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import SelectFormEle from "@/components/ui/form/select-form-element";
import TextFormEle from "@/components/ui/form/text-form-element";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { handleReqWithToaster } from "@/lib/handle-req-with-toaster";
import {
  useCreateCategoryMutation,
  useGetAllCategoriesQuery,
} from "@/redux/features/(waraqah)/categories/categoriesApi";
import {
  useCreateNewOfferMutation,
  useGetSingleOfferQuery,
  useUpdateOfferMutation,
} from "@/redux/features/(waraqah)/offers/offersApi";
import { useGetAllProductsQuery } from "@/redux/features/products/productsApi";
import { CreateCategoryDto } from "@/types/(waraqah)/category";
import { IOffer } from "@/types/(waraqah)/offer";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BadgeDollarSign,
  Box,
  Loader,
  Pencil,
  Plus,
  Upload,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
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

export default function EditOfferSheet({
  children,
  offer,
}: {
  children: React.ReactNode;
  offer: IOffer;
}) {
  // States and Hooks
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form management
  const form = useForm<NewOfferFormFields>({
    resolver: zodResolver(newOfferScehma),
    defaultValues: {
      title: offer.title,
      description: offer.description,
      start_date: new Date(offer.start_date),
      end_date: new Date(offer.end_date),
      new_price: offer.new_price,
      product_id: `${offer.product_id}`,
    },
  });
  const {
    formState: { errors },
    watch,
  } = form;

  // Queries
  const { data: products, isLoading: isProductsLoading } =
    useGetAllProductsQuery({ per_page: 100 });
  const chosenProduct = products?.data.data.find(
    (p) => `${p.id}` === form.watch("product_id")
  );

  // Mutations
  const [updateOffer, { isLoading: isUpdatingOffer }] =
    useUpdateOfferMutation();

  // Functions
  const handleOnSubmit = (data: NewOfferFormFields) => {
    if (!data.image && !imagePreview) return toast.error("صورة العرض مطلوبة");
    handleReqWithToaster("...جاري تحديث العرض", async () => {
      const formData = new FormData();
      formData.append("id", `${offer.id}`);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append(
        "start_date",
        data.start_date.toLocaleDateString("en-CA")
      );
      formData.append("end_date", data.end_date.toLocaleDateString("en-CA"));
      formData.append("new_price", data.new_price.toString());
      formData.append("product_id", data.product_id);
      if (!!data.image) formData.append("image", data.image);
      formData.append("_method", "PUT");
      await updateOffer(formData).unwrap();

      console.log(formData.get("new_price"));

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

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side={"left"} className="w-[80vw] md:w-[60vw]">
        <SheetTitle className="flex items-center gap-2 px-4 pt-4 pb-4 border-b">
          <div className="bg-gray-200 rounded-xl flex-center w-10 h-10">
            <BadgeDollarSign className="opacity-50" />
          </div>
          <span className="text-20 font-medium">تعديل العرض</span>
        </SheetTitle>
        <div className="h-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit)}
              className="flex flex-col justify-between h-[87.5%] overflow-y-auto"
            >
              <div className="py-4 px-4 sm:px-6 md:grid md:grid-cols-2 space-y-4 md:space-y-0 md:gap-4">
                <div>
                  <TextFormEle
                    form={form}
                    name="title"
                    label="العنوان*"
                    placeholder="خصم 5% على كل المنتجات"
                  />
                </div>
                <div>
                  <TextFormEle
                    form={form}
                    name="description"
                    label="الوصف*"
                    placeholder="اغتنم العرض الآن"
                  />
                </div>

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

                <TextFormEle
                  form={form}
                  name="start_date"
                  label="تاريخ البدء*"
                  type="date"
                />
                <TextFormEle
                  form={form}
                  name="end_date"
                  label="تاريخ الإنتهاء*"
                  type="date"
                />

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
                  disabled={isUpdatingOffer}
                  className="rounded-lg border-black/20 !text-black/60 hover:!text-black/80 w-full sm:w-fit"
                >
                  تجاهل
                </Button>
                <Button
                  icon={<Pencil />}
                  disabled={isUpdatingOffer}
                  className="rounded-lg w-full sm:w-40"
                >
                  تعديل العرض
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
