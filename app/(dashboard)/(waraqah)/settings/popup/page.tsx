"use client";

import type React from "react";

import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Form } from "@/components/ui/form";
import TextFormEle from "@/components/ui/form/text-form-element";
import SelectFormEle from "@/components/ui/form/select-form-element";
import { useGetAllCategoriesQuery } from "@/redux/features/(waraqah)/categories/categoriesApi";
import { toast } from "sonner";
import { handleReqWithToaster } from "@/lib/handle-req-with-toaster";
import { useCreateNewProductMutation } from "@/redux/features/products/productsApi";
import { useRouter } from "next/navigation";
import { OffersDropdown } from "@/components/popup/OffersDropdown";
import {
  useGetPopupInfoQuery,
  useUpdatePopupInfoMutation,
} from "@/redux/features/(waraqah)/settings/settingsApi";
import { Skeleton } from "@/components/ui/skeleton";
// import OfferDialog from "@/components/website/shared/OfferDialog";
import { IOffer } from "@/types/(waraqah)/offer";
import { useGetAllOffersQuery } from "@/redux/features/(waraqah)/offers/offersApi";

// Define the form schema with Zod
const productSchema = z.object({
  offer_id: z.string().min(1, "اسم المنتج مطلوب"),
  is_active: z.number(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface FileWithPreview {
  id: string;
  url: string;
  file: File | null;
}

export default function ProductForm() {
  // Hooks
  const [images, setImages] = useState<FileWithPreview[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isPreview, setIsPreview] = useState(false);
  const { data: popup, isLoading } = useGetPopupInfoQuery();

  // Form Management
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });
  const selectedOffer = form.watch("offer_id");

  // Queries
  const { data: offers } = useGetAllOffersQuery({
    page: 1,
    per_page: 200,
  });

  const selectedOfferData = offers?.data.data.find(
    (offer) => `${offer.id}` === selectedOffer
  );

  // Mutations
  const [updatePopupInfo, { isLoading: isUpdatePopupLoading }] =
    useUpdatePopupInfoMutation();

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

    handleReqWithToaster("...جاري تحديث اعدادات النافذة", async () => {
      const formData = new FormData();

      formData.set("offer_id", data.offer_id);
      formData.set("is_active", `${data.is_active}`);
      if (images.length > 0 && images[0].file)
        formData.append("popup_image", images[0].file);

      // Apply the API mutation
      await updatePopupInfo(formData).unwrap();
    });
  };

  // Side Effects
  useEffect(() => {
    if (popup) {
      form.reset({
        is_active: Number(popup.data.is_active),
        offer_id: String(popup.data.offer.id),
      });
      setImages([
        {
          id: String(Date.now()),
          file: null,
          url: popup.data.popup_image,
        },
      ]);
    }
  }, [popup]);

  return (
    <div className="p-4">
      <div>
        <h1 className="mt-2 mb-6 text-32 font-semibold">
          إعدادات النافذة المنبثقة
        </h1>
      </div>
      {isLoading ? (
        <div className="p-4 border rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Information Section */}
          <div className="order-2 md:order-1 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <Skeleton className="h-12" />

              <div className="flex gap-2">
                <Skeleton className="rounded-2xl h-12 w-44" />
                <Skeleton className="rounded-full h-12 w-12" />
              </div>
            </div>

            <div className="grid grid-cols-6 w-full gap-2 mt-52">
              <Skeleton className="h-12 rounded-lg col-span-2" />
              <Skeleton className="h-12 rounded-lg col-span-4" />
            </div>
          </div>

          {/* Product Images Section */}
          <div className=" order-1 md:order-2 space-y-6">
            <Skeleton className="w-full h-full rounded-2xl" />
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-4 border rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Main Information Section */}
            <div className="order-2 md:order-1  h-full flex flex-col justify-between">
              <div className="space-y-4">
                <OffersDropdown
                  defaultValue={popup?.data.offer.id!}
                  onOfferSelect={(offer_id) =>
                    form.setValue("offer_id", `${offer_id}`)
                  }
                />
                {form.formState.errors.offer_id ? (
                  <span className="text-red-400">
                    {form.formState.errors.offer_id?.message}
                  </span>
                ) : null}

                <div className="flex items-center justify-start gap-4 space-x-2 rtl:space-x-reverse">
                  <Label htmlFor="is_active" className="text-right">
                    تفعيل
                  </Label>
                  <Switch
                    id="is_active"
                    dir="ltr"
                    checked={Boolean(form.watch("is_active"))}
                    onCheckedChange={(checked) => {
                      form.setValue("is_active", Number(checked));
                    }}
                  />
                </div>
              </div>

              {/* <div className="grid grid-cols-6 w-full gap-2 mt-8">
                <OfferDialog
                  key={String(popup?.data.offer.id! + +isPreview)}
                  isOpen={isPreview}
                  onOpenChange={setIsPreview}
                  offer={{
                    id: selectedOfferData?.id!,
                    title: selectedOfferData?.title!,
                    description: selectedOfferData?.description!,
                    product_price: selectedOfferData?.product.price!,
                    new_price: selectedOfferData?.new_price!,
                    product_name: selectedOfferData?.product.name!,
                    product_id: selectedOfferData?.product.id!,
                    image_url: selectedOfferData?.product.image!,
                    start_date: selectedOfferData?.start_date!,
                    end_date: selectedOfferData?.end_date!,
                  }}
                  popupImage={images[0]?.url || ""}
                />
                <Button
                  type="button"
                  variant={"outline"}
                  className="border-black/20 !text-black/70 rounded-lg col-span-2"
                  onClick={() => setIsPreview(true)}
                >
                  إستعراض
                </Button>
                <Button type="submit" className="rounded-lg col-span-4">
                  حفظ إعدادات النافذة
                </Button>
              </div> */}
            </div>

            {/* Product Images Section */}
            <div className=" order-1 md:order-2 space-y-6">
              <div className="border rounded-lg p-4">
                <div className="w-full bg-gray-100 rounded-lg overflow-hidden mb-4 h-80 relative">
                  {images.length > 0 ? (
                    <>
                      <img
                        src={images[selectedImage]?.url}
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
      )}
    </div>
  );
}
