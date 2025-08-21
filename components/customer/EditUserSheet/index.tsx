"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import TextFormEle from "@/components/ui/form/text-form-element";
import SelectFormEle from "@/components/ui/form/select-form-element";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  useUpdateUserMutation,
  useGetGovernoratesQuery,
  useGetCitiesQuery,
} from "@/redux/features/(waraqah)/user/userApi";
import { handleReqWithToaster } from "@/lib/handle-req-with-toaster";
import { Pencil, User } from "lucide-react";
import { YEAR_OPTIONS } from "@/constants";
import { IUser } from "@/types/(waraqah)/user";

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "الاسم مطلوب ويجب أن يكون 3 أحرف على الأقل" }),
  alternative_phone: z
    .string()
    .min(11, { message: "رقم الهاتف البديل يجب أن يكون 11 رقم على الأقل" })
    .max(11, { message: "رقم الهاتف البديل يجب أن يكون 11 رقم" })
    .regex(/^01[0125][0-9]{8}$/, { message: "رقم الهاتف البديل غير صالح" })
    .optional(),
  phone: z
    .string()
    .min(11, { message: "رقم الهاتف يجب أن يكون 11 رقم على الأقل" })
    .max(11, { message: "رقم الهاتف يجب أن يكون 11 رقم" })
    .regex(/^01[0125][0-9]{8}$/, { message: "رقم الهاتف غير صالح" }),
  password: z
    .string()
    .min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" })
    .optional(),
  year: z.string(),
  role: z.enum(["user", "admin"]),
  device_name: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  governorate: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditUserSheet({
  children,
  user,
}: {
  children: React.ReactNode;
  user: IUser;
}) {
  const [open, setOpen] = useState(false);

  // Form management
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      alternative_phone: "",
      phone: "",
      password: "",
      year: "12",
      role: "user",
      device_name: "",
      address: "",
      city: "",
      governorate: "",
    },
  });

  // Set form values when user data is available
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        alternative_phone: user.alternative_phone,
        phone: user.phone,
        year: `${user.year}`,
        role: user.role,
        device_name: "",
        address: `${user.address}`,
        city: `${user.city_id}`,
        governorate: `${user.governorate_id}`,
      });
    }
  }, [user, form]);

  // Queries
  const { data: governoratesData, isLoading: isGovernoratesLoading } =
    useGetGovernoratesQuery();
  const selectedGovernorate = form.watch("governorate");

  const { data: citiesData, isLoading: isCitiesLoading } = useGetCitiesQuery(
    +selectedGovernorate!,
    { skip: !selectedGovernorate }
  );

  // Mutations
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  // Reset city when governorate changes
  useEffect(() => {
    if (selectedGovernorate) {
      form.setValue("city", "");
    }
  }, [selectedGovernorate, form]);

  const onSubmit = async (values: FormValues) => {
    handleReqWithToaster("جاري تحديث المستخدم...", async () => {
      await updateUser({ id: user.id, ...values }).unwrap();
      // setOpen(false);
    });
  };

  // Prepare options for select elements
  const governorateOptions =
    governoratesData?.data.data.map((gov) => ({
      label: gov.name,
      value: gov.id.toString(),
    })) || [];

  const cityOptions =
    citiesData?.data.data.map((city) => ({
      label: city.name,
      value: city.id.toString(),
    })) || [];

  const resetSheet = () => {
    setOpen(false);
    form.reset();
  };

  useEffect(() => {
    if (!!citiesData) form.setValue("city", `${user.city_id}`);
  }, [citiesData]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side={"left"}>
        <div className="flex items-center gap-2 px-4 pt-4 pb-4 border-b">
          <div className="bg-gray-200 rounded-xl flex-center w-10 h-10">
            <User className="opacity-50" />
          </div>
          <span className="text-20 font-medium">تعديل المستخدم</span>
        </div>

        <div className="h-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col justify-between h-[87.5%] overflow-y-scroll pt-4 px-4"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <TextFormEle
                  form={form}
                  name="name"
                  label="الاسم*"
                  placeholder="اسم المستخدم"
                />

                <TextFormEle
                  form={form}
                  name="phone"
                  label="رقم الهاتف*"
                  placeholder="رقم الهاتف"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <TextFormEle
                  form={form}
                  name="alternative_phone"
                  label="رقم الهاتف البديل (اختياري)"
                  placeholder="رقم الهاتف البديل"
                />

                <TextFormEle
                  form={form}
                  name="device_name"
                  label="اسم الجهاز (اختياري)"
                  placeholder="اسم الجهاز"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <SelectFormEle
                  form={form}
                  name="year"
                  label="المرحلة الدراسية*"
                  placeholder="اختر المرحلة الدراسية"
                  options={YEAR_OPTIONS}
                />

                <SelectFormEle
                  form={form}
                  name="role"
                  label="نوع الحساب*"
                  placeholder="اختر الدور"
                  options={[{ label: "مستخدم", value: "user" }]}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <TextFormEle
                  form={form}
                  name="address"
                  label="العنوان (اختياري)"
                  placeholder="العنوان"
                />

                <TextFormEle
                  form={form}
                  name="password"
                  label="كلمة المرور (اختياري)"
                  placeholder="كلمة المرور"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <SelectFormEle
                  form={form}
                  name="governorate"
                  label="المحافظة (اختياري)"
                  placeholder={
                    isGovernoratesLoading ? "جاري التحميل..." : "اختر المحافظة"
                  }
                  options={governorateOptions}
                  disabled={isGovernoratesLoading}
                />

                <SelectFormEle
                  form={form}
                  name="city"
                  label="المدينة (اختياري)"
                  placeholder={
                    isCitiesLoading ? "جاري التحميل..." : "اختر المدينة"
                  }
                  options={cityOptions}
                  disabled={!selectedGovernorate || isCitiesLoading}
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row border-t pt-4 items-center justify-end gap-2">
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
                  icon={<Pencil />}
                  disabled={isLoading}
                  className="rounded-lg w-full sm:w-40"
                >
                  تحديث المستخدم
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
