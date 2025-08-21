import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define the tracking form schema with Zod
const trackingFormSchema = z.object({
  tracking_number: z.string().min(1, { message: "رقم التتبع مطلوب" }),
  tracking_url: z.string().url({ message: "يرجى إدخال رابط صحيح" }),
});

// Define the type based on the schema
type TrackingFormValues = z.infer<typeof trackingFormSchema>;

function TrackingInfoForm({
  onSubmit,
  onClose,
}: {
  onSubmit: (tracking_url: string, trucking_number: string) => void;
  onClose: () => void;
}) {
  // Initialize the form with React Hook Form and Zod resolver
  const form = useForm<TrackingFormValues>({
    resolver: zodResolver(trackingFormSchema),
    defaultValues: {
      tracking_number: "",
      tracking_url: "",
    },
  });

  const onSubmitHandler = (data: TrackingFormValues) => {
    onSubmit(data.tracking_url, data.tracking_number);
    onClose();
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="tracking_number"
            className="block text-sm font-medium"
          >
            رقم التتبع
          </label>
          <input
            {...form.register("tracking_number")}
            id="tracking_number"
            type="text"
            placeholder="أدخل رقم التتبع"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {form.formState.errors.tracking_number && (
            <p className="text-sm text-red-500">
              {form.formState.errors.tracking_number.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="tracking_url" className="block text-sm font-medium">
            رابط التتبع
          </label>
          <input
            {...form.register("tracking_url")}
            id="tracking_url"
            type="url"
            placeholder="أدخل رابط التتبع"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {form.formState.errors.tracking_url && (
            <p className="text-sm text-red-500">
              {form.formState.errors.tracking_url.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-1/2 sm:w-1/4 rounded-lg"
            onClick={onClose}
            // disabled={isLoading}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            className="w-1/2 sm:w-1/4 rounded-lg"
            // disabled={isLoading}
          >
            {/* {isLoading ? "جاري الحفظ..." : "حفظ"} */}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default TrackingInfoForm;
