import { toast } from "sonner";

export const handleReqWithToaster = async (
  toastTitle: string,
  fn: () => Promise<void>
) => {
  const tID = toast.loading(toastTitle, {
    description: "يرجى الإنتظار لبضع ثوانٍ",
  });
  try {
    await fn();
  } catch (error) {}
  toast.dismiss(tID);
};
