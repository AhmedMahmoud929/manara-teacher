"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import Logo from "@/components/shared/Logo";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import TextFormEle from "@/components/ui/form/text-form-element";
import PasswordSuffix from "@/components/ui/form/password-suffix";
import { LoginUserDto } from "@/types/(waraqah)/user";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

// Define form schema to match LoginUserDto
const formSchema = z.object({
  login: z.string().email("يرجى إدخال بريد إلكتروني صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function Login() {
  // States and Hooks
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");
  const isAdmin = Boolean(redirectPath?.startsWith("/dashboard"));

  // Mutation
  const [loginUser, { isLoading }] = useLoginMutation();

  // Form Management
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (formValues: LoginFormValues) => {
    try {
      // Prepare data according to LoginUserDto interface
      const loginData: LoginUserDto = {
        login: formValues.login,
        password: formValues.password,
      };

      // Call the login mutation
      await loginUser(loginData).unwrap();

      // Navigate on success
      router.push(redirectPath || "/");
    } catch (error) {
      // Error handling is done by the baseApi interceptor
      console.error("Login failed:", error);
    }
  };

  useEffect(() => {
    if (isAdmin)
      form.reset({
        login: "admin@example.com",
        password: "123456",
      });
  }, [isAdmin, form]);

  return (
    <>
      {/* Logo */}
      <div className="self-start">
        <Logo />
      </div>

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full sm:px-4 lg:px-12 flex-1 flex flex-col justify-center mx-auto"
        >
          <h1 className="text-24 font-bold mb-2">
            تسجيل الدخول
            <span className="text-16 mr-2 opacity-70">
              {isAdmin && "(Admin)"}
            </span>
          </h1>

          <p className="text-gray-600 mb-6">
            سجل الآن واستمتع بتجربة سلسة مع منصة منارة
          </p>

          <div className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <TextFormEle
                form={form}
                name="login"
                label="البريد الإلكتروني"
                placeholder="example@email.com"
                type="email"
                inputClassName="flex-grow rounded-lg"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <TextFormEle
                form={form}
                name="password"
                label="كلمة المرور"
                placeholder="أدخل كلمة مرور"
                type={showPassword ? "text" : "password"}
                className="relative"
                inputClassName="pl-10"
                prefix={
                  <PasswordSuffix
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                  />
                }
              />
              <div className="text-left">
                <Link
                  href="#"
                  className="text-sm text-[#3eb489] hover:underline"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary disabled:bg-primary/50 text-white py-2 px-4 rounded-lg"
            >
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-primary focus-visible:ring-primary border-gray-300 rounded"
                {...form.register("remember")}
              />
              <label
                htmlFor="remember"
                className="mr-2 block text-sm text-gray-700"
              >
                تذكرني
              </label>
            </div>
          </div>
        </form>
      </Form>

      {/* Bottom btns */}
      <div className="mt-8 md:mt-0 flex flex-col lg:flex-row items-center justify-between gap-2 md:gap-0">
        <p className="text-gray-600">
          ليس لديك حساب؟{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            إنشاء حساب
          </Link>
        </p>

        <Link href="/" className="text-gray-600 flex items-center">
          <span>العودة إلى الرئيسية</span>
          <ChevronLeft size={18} />
        </Link>
      </div>
    </>
  );
}
