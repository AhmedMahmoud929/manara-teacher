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
import { useUpdateOrderStatusMutation } from "@/redux/features/(waraqah)/orders/ordersApi";
import { CreateCategoryDto } from "@/types/(waraqah)/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Plus, Truck } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define the tracking form schema with Zod
const trackingFormSchema = z.object({
  tracking_number: z.string().min(1, { message: "رقم التتبع مطلوب" }),
  tracking_url: z.string().url({ message: "يرجى إدخال رابط صحيح" }),
});

// Define the type based on the schema
type TrackingFormValues = z.infer<typeof trackingFormSchema>;

function OrderDeliverySheet({
  children,
  orderId,
}: {
  children: React.ReactNode;
  orderId: number;
}) {
  // States and Hooks
  const [open, setOpen] = useState(false);

  // Mutations
  const [changeOrderStatus, { isLoading }] = useUpdateOrderStatusMutation();

  // Form Management
  const form = useForm<TrackingFormValues>({
    resolver: zodResolver(trackingFormSchema),
    defaultValues: { tracking_number: "", tracking_url: "" },
  });

  const onSubmitHandler = ({
    tracking_url,
    tracking_number,
  }: TrackingFormValues) => {
    handleReqWithToaster("جاري تحديث حالة الطلب", async () => {
      await changeOrderStatus({
        id: orderId,
        order_status: "shipped",
        tracking_url,
        tracking_number,
      }).unwrap();
      resetSheet();
    });
  };

  const resetSheet = () => {
    setOpen(false);
    form.reset();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side={"left"}>
        <div className="flex items-center gap-2 px-4 pt-4 pb-4 border-b">
          <div className="bg-gray-200 rounded-xl flex-center w-10 h-10">
            <Truck className="opacity-50" />
          </div>
          <span className="text-20 font-medium">تعديل بيانات التتبع</span>
        </div>

        <div className="h-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitHandler)}
              className="px-4 pt-4 flex flex-col justify-between h-[87.5%]"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <TextFormEle
                  form={form}
                  name="tracking_number"
                  label="رقم التتبع"
                  type="text"
                  placeholder="أدخل رقم التتبع"
                />

                <TextFormEle
                  form={form}
                  name="tracking_url"
                  label="رابط التتبع"
                  type="text"
                  placeholder="أدخل رابط التتبع"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row px-4 border-t pt-4 items-center justify-end gap-2">
                <Button
                  variant={"outline"}
                  onClick={resetSheet}
                  type="button"
                  disabled={isLoading}
                  className="rounded-lg border-black/20 !text-black/60 hover:!text-black/80 w-full sm:w-fit"
                >
                  تجاهل
                </Button>
                <Button
                  disabled={isLoading}
                  className="rounded-lg w-full sm:w-40"
                >
                  {isLoading ? "جاري الحفظ..." : "حفظ"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default OrderDeliverySheet;
