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
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import {
  useCreateCategoryMutation,
  useGetAllCategoriesQuery,
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
} from "@/redux/features/(waraqah)/categories/categoriesApi";
import {
  setEditCategoryId,
  setIsEditCategorySheetOpen,
} from "@/redux/features/(waraqah)/categories/categorySlice";
import { CreateCategoryDto } from "@/types/(waraqah)/category";
import { IGovernateAdmin } from "@/types/(waraqah)/governates";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Pen, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUpdateAdminGovernateMutation } from "@/redux/features/(waraqah)/settings/settingsApi";

const updateGovernateScehma = z.object({
  name: z.string({ message: "الاسم مطلوب" }),
  price: z.number({ message: "السعر مطلوب" }),
  breakable_price: z.number({ message: "السعر مطلوب" }),
  is_active: z.boolean(),
});

type UpdateGovernateFormFields = z.infer<typeof updateGovernateScehma>;

export function EditGovernateSheet({
  governate,
  children,
}: {
  governate: IGovernateAdmin;
  children: React.ReactNode;
}) {
  // States and Hooks
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  // Form management
  const form = useForm<UpdateGovernateFormFields>({
    resolver: zodResolver(updateGovernateScehma),
    defaultValues: {
      name: governate.name || "",
      price: Number(governate.price),
      breakable_price: Number(governate.breakable_price),
      is_active: Boolean(governate.is_active),
    },
  });

  // Mutations
  const [updateGovernate, { isLoading: isUpdatingGovernate }] =
    useUpdateAdminGovernateMutation();

  // Functions
  const handleOnSubmit = (data: UpdateGovernateFormFields) => {
    handleReqWithToaster("...جاري تعديل المحافظة", async () => {
      await updateGovernate({
        id: governate.id,
        data: {
          price: data.price,
          breakable_price: data.breakable_price,
          is_active: Number(data.is_active),
        },
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
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent side={"left"}>
        <div className="flex items-center gap-2 px-4 pt-4 pb-4 border-b">
          <div className="bg-gray-200 rounded-xl flex-center w-10 h-10">
            <Box className="opacity-50" />
          </div>
          <SheetTitle className="text-20 font-medium">
            تعديل المحافظة
          </SheetTitle>
        </div>

        <div className="h-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit)}
              className="flex flex-col justify-between h-[87.5%]"
            >
              <div className="py-4 px-4 sm:px-6 grid md:grid-cols-2 gap-2 sm:gap-4">
                <TextFormEle
                  form={form}
                  name="name"
                  label="الاسم*"
                  placeholder="القاهرة"
                  className="col-span-2"
                  disabled={true}
                />

                <TextFormEle
                  form={form}
                  name="price"
                  label="السعر*"
                  placeholder="100"
                  type="number"
                  disabled={isUpdatingGovernate}
                />

                <TextFormEle
                  form={form}
                  name="breakable_price"
                  label="السعر للمنتجات القابلة *"
                  placeholder="100"
                  type="number"
                  disabled={isUpdatingGovernate}
                />

                <div className="flex items-center space-x-2 col-span-2 md:w-96 rtl:space-x-reverse">
                  <Switch
                    id="is_active"
                    dir="ltr"
                    checked={form.watch("is_active")}
                    onCheckedChange={(checked) => {
                      form.setValue("is_active", checked, {
                        shouldValidate: true,
                      });
                    }}
                    disabled={isUpdatingGovernate}
                  />
                  <Label htmlFor="is_active" className="mr-2">
                    مفعل
                  </Label>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row px-4 border-t pt-4 items-center justify-end gap-2">
                <Button
                  variant={"outline"}
                  onClick={resetSheet}
                  type="button"
                  disabled={isUpdatingGovernate}
                  className="rounded-lg border-black/20 !text-black/60 hover:!text-black/80 w-full sm:w-fit"
                >
                  تجاهل
                </Button>
                <Button
                  icon={<Pen />}
                  disabled={isUpdatingGovernate}
                  className="rounded-lg w-full sm:w-40"
                >
                  تعديل المحافظة
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
