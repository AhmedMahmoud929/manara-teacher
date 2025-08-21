import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import SelectFormEle from "@/components/ui/form/select-form-element";
import TextFormEle from "@/components/ui/form/text-form-element";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { handleReqWithToaster } from "@/lib/handle-req-with-toaster";
import { useGetAllProductsQuery } from "@/redux/features/products/productsApi";
import { useUpdateInventoryMutation } from "@/redux/features/(waraqah)/inventory/inventoryApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Factory, Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, parse } from "date-fns";

const inventorySchema = z.object({
  product_id: z.string().min(1, "المنتج مطلوب"),
  movement_type: z.enum(["in", "out"], {
    required_error: "نوع الحركة مطلوب",
  }),
  quantity: z.number().min(1, "الكمية مطلوبة"),
  movement_date: z.date({ invalid_type_error: "تاريخ المعاملة مطلوب" }),
  reference: z.string().min(1, "المرجع مطلوب"),
  notes: z.string().optional(),
});

type InventoryFormFields = z.infer<typeof inventorySchema>;

interface EditInventoryFormProps {
  children: React.ReactNode;
  inventoryItem: {
    id: number;
    product_id: number;
    movement_type: "in" | "out";
    quantity: number;
    movement_date: string;
    reference: string;
    notes?: string;
  };
}

function EditInventoryForm({
  children,
  inventoryItem,
}: EditInventoryFormProps) {
  // States and Hooks
  const [open, setOpen] = useState(false);

  // Form management
  const form = useForm<InventoryFormFields>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      product_id: "",
      movement_type: "in",
      quantity: 1,
      movement_date: new Date(),
      reference: "",
      notes: "",
    },
  });

  // Set form values when inventory item changes
  useEffect(() => {
    if (inventoryItem) {
      form.reset({
        product_id: String(inventoryItem.product_id),
        movement_type: inventoryItem.movement_type,
        quantity: inventoryItem.quantity,
        movement_date: inventoryItem.movement_date
          ? parse(
              inventoryItem.movement_date,
              "yyyy-MM-dd HH:mm:ss",
              new Date()
            )
          : new Date(),
        reference: inventoryItem.reference,
        notes: inventoryItem.notes || "",
      });
    }
  }, [inventoryItem, form]);

  // Queries
  const { data: products, isLoading: isProductsLoading } =
    useGetAllProductsQuery({
      per_page: 100,
    });

  // Mutations
  const [updateInventory, { isLoading: isUpdatingInventory }] =
    useUpdateInventoryMutation();

  // Functions
  const handleOnSubmit = (data: InventoryFormFields) => {
    handleReqWithToaster("...جاري تحديث حركة المخزون", async () => {
      await updateInventory({
        id: inventoryItem.id,
        ...data,
        movement_date: format(data.movement_date, "yyyy-MM-dd"),
      } as any).unwrap();
      resetSheet();
    });
  };

  const resetSheet = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side={"left"}>
        <div className="flex items-center gap-2 px-4 pt-4 pb-4 border-b">
          <div className="bg-gray-200 rounded-xl flex-center w-10 h-10">
            <Factory className="opacity-50" />
          </div>
          <span className="text-20 font-medium">تعديل حركة المخزون</span>
        </div>

        <div className="h-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit)}
              className="flex flex-col justify-between h-[87.5%]"
            >
              <div className="py-4 px-4 sm:px-6 grid md:grid-cols-2 gap-2 sm:gap-4">
                <SelectFormEle
                  options={
                    products?.data.data.map(({ id, name }) => ({
                      label: name,
                      value: `${id}`,
                    })) || []
                  }
                  form={form}
                  name="product_id"
                  label="المنتج*"
                  placeholder={
                    isProductsLoading ? "جاري التحميل ..." : "اختر المنتج"
                  }
                  disabled={isProductsLoading}
                  className="col-span-2"
                />

                <SelectFormEle
                  options={[
                    { label: "داخل", value: "in" },
                    { label: "خارج", value: "out" },
                  ]}
                  form={form}
                  name="movement_type"
                  label="نوع الحركة*"
                  placeholder="اختر نوع الحركة"
                />

                <TextFormEle
                  form={form}
                  name="quantity"
                  label="الكمية*"
                  type="number"
                  placeholder="أدخل الكمية"
                />

                <TextFormEle
                  form={form}
                  name="movement_date"
                  label="تاريخ الحركة*"
                  type="date"
                />

                <TextFormEle
                  form={form}
                  name="reference"
                  label="المرجع*"
                  placeholder="مثال: Invoice #123"
                />

                <TextFormEle
                  form={form}
                  name="notes"
                  label="ملاحظات"
                  placeholder="أدخل ملاحظات إضافية"
                  className="col-span-2"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row px-4 border-t pt-4 items-center justify-end gap-2">
                <Button
                  variant={"outline"}
                  onClick={resetSheet}
                  type="button"
                  disabled={isUpdatingInventory}
                  className="rounded-lg border-black/20 !text-black/60 hover:!text-black/80 w-full sm:w-fit"
                >
                  تجاهل
                </Button>
                <Button
                  icon={<Pencil />}
                  disabled={isUpdatingInventory}
                  className="rounded-lg w-full sm:w-40"
                >
                  تحديث
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default EditInventoryForm;
