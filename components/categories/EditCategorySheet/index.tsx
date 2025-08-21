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
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Pen, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const updateCategoryScehma = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  is_active: z.boolean(),
  // description: z.string().min(1, "الوصف مطلوب"),
  // parent: z.string().optional(),
});

type UpdateCategoryFormFields = z.infer<typeof updateCategoryScehma>;

const formInit = {
  name: "",
  is_active: true,
  // description: "",
  // parent: "",
};

export function EditCategorySheet({
  id,
  children,
}: {
  id: number;
  children: React.ReactNode;
}) {
  // States and Hooks
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  // Form management
  const form = useForm<UpdateCategoryFormFields>({
    resolver: zodResolver(updateCategoryScehma),
    defaultValues: formInit,
  });

  // Queries
  const {
    data: category,
    isLoading: isCategoryLoading,
    isFetching: isCategoryFetching,
    refetch,
  } = useGetSingleCategoryQuery(id, {
    skip: !open || !id,
  });

  // We might need it later with parent select
  // const { data: allCategories, isLoading: isAllCategoriesLoading } =
  //   useGetAllCategoriesQuery({});

  // Mutations
  const [updateCategory, { isLoading: isUpdatingCategory }] =
    useUpdateCategoryMutation();

  // Functions
  const handleOnSubmit = (data: UpdateCategoryFormFields) => {
    handleReqWithToaster("...جاري تعديل القسم", async () => {
      // Convert boolean to "1" or "0" for API
      const formData = {
        id,
        ...data,
        is_active: data.is_active ? "1" : "0"
      };
      await updateCategory(formData).unwrap();
      resetSheet();
    });
  };
  const resetSheet = () => {
    setOpen(false);
    form.reset(formInit);
  };

  // Side Effects
  useEffect(() => {
    if (category?.data && open) {
      form.setValue("name", category.data.name);
      form.setValue("is_active", 
        category.data.is_active !== undefined 
          ? Boolean(Number(category.data.is_active)) 
          : true
      );
      // form.setValue("description", category.data.description || "");
      // form.setValue("parent", category.data.parent || "");
    }
  }, [category]);

  useEffect(() => {
    if (open && id) {
      refetch();
    }
  }, [open, id, refetch]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent side={"left"}>
        <div className="flex items-center gap-2 px-4 pt-4 pb-4 border-b">
          <div className="bg-gray-200 rounded-xl flex-center w-10 h-10">
            <Box className="opacity-50" />
          </div>
          <SheetTitle className="text-20 font-medium">
            تعديل القسم :{" "}
            {isCategoryLoading || isCategoryFetching
              ? "جاري التحميل ..."
              : category?.data.name}
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
                  placeholder="منتجات مدرسية"
                  className="col-span-2 md:w-96"
                  disabled={
                    isCategoryFetching ||
                    isCategoryLoading ||
                    isUpdatingCategory
                  }
                />
                
                <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse col-span-2 mt-2">
                  <Switch
                    id="is_active"
                    dir="ltr"
                    checked={form.watch("is_active")}
                    onCheckedChange={(checked) => {
                      form.setValue("is_active", checked);
                    }}
                    disabled={
                      isCategoryFetching ||
                      isCategoryLoading ||
                      isUpdatingCategory
                    }
                  />
                  <Label htmlFor="is_active" className="text-right">
                    نشط
                  </Label>
                </div>
                
                {/* <SelectFormEle
                  options={
                    categories?.data.data.map(({ id, name }) => ({
                      label: name,
                      value: `${id}`,
                    })) || []
                  }
                  form={form}
                  name="parent"
                  label="القسم الاب"
                  placeholder={
                    isCategoriesLoading ? "جاري التحميل ..." : "اختر القسم"
                  }
                  disabled={isCategoriesLoading}
                />
                <TextFormEle
                  form={form}
                  name="description"
                  label="الوصف"
                  placeholder="منتجات مدرسية"
                  className="col-span-2"
                /> */}
              </div>

              <div className="flex flex-col-reverse sm:flex-row px-4 border-t pt-4 items-center justify-end gap-2">
                <Button
                  variant={"outline"}
                  onClick={resetSheet}
                  type="button"
                  disabled={isUpdatingCategory}
                  className="rounded-lg border-black/20 !text-black/60 hover:!text-black/80 w-full sm:w-fit"
                >
                  تجاهل
                </Button>
                <Button
                  icon={<Pen />}
                  disabled={isUpdatingCategory}
                  className="rounded-lg w-full sm:w-40"
                >
                  تعديل القسم
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
