import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import SelectFormEle from "@/components/ui/form/select-form-element";
import TextFormEle from "@/components/ui/form/text-form-element";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { generateCoupon } from "@/lib/generate-coupon";
import { handleReqWithToaster } from "@/lib/handle-req-with-toaster";
import { useCreateNewCouponMutation } from "@/redux/features/(waraqah)/coupons/couponsApi";
import { CreateCouponDto } from "@/types/(waraqah)/coupons";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { BadgeDollarSign, Plus, Repeat2, Ticket } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const couponSchema = z
  .object({
    code: z.string().min(1, "كود الكوبون مطلوب"),
    discount_percentage: z
      .number({ message: "نسبة الخصم مطلوبة" })
      .min(1, "نسبة الخصم لا يمكن ان تكون اقل من 1%")
      .max(100, "نسبة الخصم لا يمكن ان تكون اكثر من 100%"),
    description: z.string({ message: "خانة الوصف مطلوبة" }),
    valid_from: z.date({ invalid_type_error: "تاريخ البداية مطلوب" }),
    valid_to: z.date({ message: "تاريخ الإنتهاء مطلوب" }),
    usage_limit: z
      .number({ message: "الحد الأقصى للاستخدام مطلوب" })
      .min(1, "الحد الأقصى للاستخدام لا يمكن ان يكون اقل من 1"),
    per_user_limit: z
      .number({ message: "الحد الأقصى للاستخدام مطلوب" })
      .min(1, "الحد الأقصى للاستخدام لا يمكن ان يكون اقل من 1"),
  })
  .refine(
    (data) => {
      const start = new Date(data.valid_from);
      const end = new Date(data.valid_to);
      return start <= end;
    },
    {
      message: "تاريخ البداية يجب أن يكون قبل أو يساوي تاريخ الإنتهاء",
      path: ["valid_to"],
    }
  );

export type CouponFormFields = z.infer<typeof couponSchema>;

export default function AddCouponSheet({
  children,
}: {
  children: React.ReactNode;
}) {
  // States and Hooks
  const [open, setOpen] = useState(false);

  // Form management
  const form = useForm<CouponFormFields>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      discount_percentage: 0,
      description: "",
      usage_limit: 0,
      per_user_limit: 0,
    },
  });

  // Mutations
  const [createNewCoupon, { isLoading }] = useCreateNewCouponMutation();

  // Functions
  const handleOnSubmit = (data: CouponFormFields) => {
    handleReqWithToaster("...جاري انشاء الكوبون", async () => {
      const preparedData: CreateCouponDto = {
        ...data,
        valid_from: format(data.valid_from, "yyyy-MM-dd"),
        valid_to: format(data.valid_to, "yyyy-MM-dd"),
      };
      await createNewCoupon(preparedData).unwrap();
      resetSheet();
    });
  };

  const resetSheet = () => {
    setOpen(false);
    form.reset({
      code: "",
      discount_percentage: 0,
      usage_limit: 0,
      description: "",
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side={"left"} className="w-[80vw] md:w-[60vw]">
        <div className="flex items-center gap-2 px-4 pt-4 pb-4 border-b">
          <div className="bg-gray-200 rounded-xl flex-center w-10 h-10">
            <Ticket className="opacity-50" />
          </div>
          <span className="text-20 font-medium">كوبون جديد</span>
        </div>

        <div className="h-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit)}
              className="flex flex-col justify-between h-[87.5%]"
            >
              <div className="py-4 px-4 sm:px-6 grid md:grid-cols-2 gap-2 sm:gap-4">
                {/* Coupon Code */}
                <TextFormEle
                  form={form}
                  name="code"
                  label="الكوبون*"
                  className="col-span-2"
                  placeholder="KHJ232"
                  suffix={
                    <Button
                      type="button"
                      onClick={() => form.setValue("code", generateCoupon())}
                      className="bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 mr-1 h-10 !text-black/80"
                    >
                      <span className="font-light">توليد</span>
                      <Repeat2 />
                    </Button>
                  }
                />

                {/* discount_percentage Percentage */}
                <TextFormEle
                  form={form}
                  name="discount_percentage"
                  label="نسبة خصم*"
                  type="number"
                  className="col-span-2"
                  prefix={<div className="mt-2 ml-2">%</div>}
                />

                <TextFormEle
                  form={form}
                  name="usage_limit"
                  label="صلاحية الإستخدام*"
                  type="number"
                />

                <TextFormEle
                  form={form}
                  name="per_user_limit"
                  label="صلاحية الإستخدام لكل مستخدم*"
                  type="number"
                />

                {/* Dates */}
                <TextFormEle
                  form={form}
                  name="valid_from"
                  label="صالح من *"
                  type="date"
                />

                <TextFormEle
                  form={form}
                  name="valid_to"
                  label="صالح إلى *"
                  type="date"
                />

                {/* Description - Full Width */}
                <TextFormEle
                  form={form}
                  name="description"
                  label="الوصف*"
                  placeholder="أدخل الوصف هنا من فضلك..."
                  className="col-span-2"
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
                  icon={<Plus />}
                  disabled={isLoading}
                  className="rounded-lg w-full sm:w-40"
                >
                  اضف الكوبون
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
