"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  CheckCircle,
  ChevronLeft,
  Circle,
  Eye,
  EyeOff,
  XCircle,
} from "lucide-react";
import Logo from "@/components/shared/Logo";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import TextFormEle from "@/components/ui/form/text-form-element";
import PasswordSuffix from "@/components/ui/form/password-suffix";
import SelectFormEle from "@/components/ui/form/select-form-element";
import { UAParser, IResult } from "ua-parser-js";
import { handleReqWithToaster } from "@/lib/handle-req-with-toaster";
import { RegisterUserDto } from "@/types/user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { YEAR_OPTIONS } from "@/constants";

// Define form schema with validation
const formSchema = z
  .object({
    firstName: z.string().min(2, "الاسم الأول يجب أن يكون حرفين على الأقل"),
    lastName: z.string().min(2, "الاسم الأخير يجب أن يكون حرفين على الأقل"),
    phone: z.string().min(11, "رقم الهاتف يجب أن يكون 11 رقم على الأقل"),
    grade: z.string().min(1, "يرجى اختيار الصف"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof formSchema>;

export default function Register() {
  // Hooks and States
  const [isTermsAccetped, setIsTermsAccepted] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  // Mutations
  const [registerUser, { isLoading }] = useRegisterMutation();

  // Form Management
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      grade: "",
      password: "",
      confirmPassword: "",
    },
  });
  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");

  // Functions
  const onSubmit = (data: RegisterFormValues) => {
    if (!isTermsAccetped) return toast.error("يرجى قبول الشروط والاحكام");
    handleReqWithToaster("جاري انشاء حساب جديد", async () => {
      const preparedData = {
        name: `${data.firstName} ${data.lastName}`,
        phone: data.phone,
        year: data.grade,
        role: "user",
        password: data.password,
        device_name: navigator.userAgent,
      };
      await registerUser(preparedData as RegisterUserDto).unwrap();
      router.push("/auth/success");
    });
  };

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
          className="w-full sm:px-4 lg:px-6 flex-1 flex flex-col justify-center mx-auto"
        >
          <h1 className="text-24 font-bold mt-4">إنشاء حساب جديد</h1>
          <p className="text-gray-600 mb-6">
            سجل الآن واستمتع بتجربة سلسة مع ورقة ستور
          </p>

          <div className="space-y-3">
            {/* First Name and Last Name (in same row) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <TextFormEle
                  form={form}
                  name="firstName"
                  label="الاسم الأول"
                  placeholder="أدخل الاسم الأول"
                />
              </div>
              <div className="space-y-2">
                <TextFormEle
                  form={form}
                  name="lastName"
                  label="الاسم الأخير"
                  placeholder="أدخل الاسم الأخير"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <TextFormEle
                form={form}
                name="phone"
                label="رقم الهاتف"
                placeholder="0000 0000"
                type="tel"
                inputClassName="flex-grow rounded-r-lg rounded-l-none"
                suffix={
                  <div className="bg-gray-100 border border-gray-300 border-r-0 rounded-l-lg px-3 flex items-center text-gray-500">
                    +20
                  </div>
                }
              />
            </div>

            {/* Grade (Select) */}
            <div className="space-y-2">
              <SelectFormEle
                form={form}
                name="grade"
                label="الصف الدراسي"
                placeholder="اختر الصف الدراسي"
                options={YEAR_OPTIONS}
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
                suffix={
                  <PasswordSuffix
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                  />
                }
              />

              {/* Password Criteria Indicators */}
              {/* {password && (
                <div className="mt-2 border rounded-md p-3 bg-gray-50">
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      {passwordCriteria.length ? (
                        <div className="text-green-500">
                          <Check size={16} />
                        </div>
                      ) : (
                        <div className="text-gray-300">
                          <Circle size={16} />
                        </div>
                      )}
                      <span
                        className={
                          passwordCriteria.length
                            ? "text-green-700"
                            : "text-gray-500"
                        }
                      >
                        على الأقل 8 أحرف
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      {passwordCriteria.uppercase ? (
                        <div className="text-green-500">
                          <Check size={16} />
                        </div>
                      ) : (
                        <div className="text-gray-300">
                          <Circle size={16} />
                        </div>
                      )}
                      <span
                        className={
                          passwordCriteria.uppercase
                            ? "text-green-700"
                            : "text-gray-500"
                        }
                      >
                        حرف كبير واحد على الأقل (A-Z)
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      {passwordCriteria.lowercase ? (
                        <div className="text-green-500">
                          <Check size={16} />
                        </div>
                      ) : (
                        <div className="text-gray-300">
                          <Circle size={16} />
                        </div>
                      )}
                      <span
                        className={
                          passwordCriteria.lowercase
                            ? "text-green-700"
                            : "text-gray-500"
                        }
                      >
                        حرف صغير واحد على الأقل (a-z)
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      {passwordCriteria.number ? (
                        <div className="text-green-500">
                          <Check size={16} />
                        </div>
                      ) : (
                        <div className="text-gray-300">
                          <Circle size={16} />
                        </div>
                      )}
                      <span
                        className={
                          passwordCriteria.number
                            ? "text-green-700"
                            : "text-gray-500"
                        }
                      >
                        رقم واحد على الأقل (0-9)
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      {passwordCriteria.special ? (
                        <div className="text-green-500">
                          <Check size={16} />
                        </div>
                      ) : (
                        <div className="text-gray-300">
                          <Circle size={16} />
                        </div>
                      )}
                      <span
                        className={
                          passwordCriteria.special
                            ? "text-green-700"
                            : "text-gray-500"
                        }
                      >
                        رمز خاص واحد على الأقل (!@#$%^&*()_+=-)
                      </span>
                    </li>
                  </ul>
                </div>
              )} */}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <TextFormEle
                form={form}
                name="confirmPassword"
                label="تأكيد كلمة المرور"
                placeholder="أعد إدخال كلمة المرور"
                type={showConfirmPassword ? "text" : "password"}
                className="relative"
                inputClassName="pl-10"
                suffix={
                  <PasswordSuffix
                    showPassword={showConfirmPassword}
                    setShowPassword={setShowConfirmPassword}
                  />
                }
              />

              {/* Password Match Indicator
              {confirmPassword && (
                <div
                  className={`flex items-center gap-2 mt-1 text-sm ${
                    passwordCriteria.match ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {passwordCriteria.match ? (
                    <>
                      <CheckCircle size={16} />
                      <span>كلمات المرور متطابقة</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={16} />
                      <span>كلمات المرور غير متطابقة</span>
                    </>
                  )}
                </div>
              )} */}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-lg"
            >
              إنشاء حساب
            </button>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-primary focus-visible:ring-primary border-gray-300 rounded"
                onChange={(e) => setIsTermsAccepted(e.target.checked)}
              />
              <label
                htmlFor="remember"
                className="mr-2 block text-sm text-gray-700"
              >
                أوافق على{" "}
                <Link href="#" className="text-primary hover:underline">
                  الشروط والأحكام
                </Link>
              </label>
            </div>
          </div>
        </form>
      </Form>

      {/* Bottom btns */}
      <div className="mt-8 flex flex-col lg:flex-row items-center justify-between gap-2 md:gap-0">
        <p className="text-gray-600">
          لديك حساب بالفعل؟{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            تسجيل الدخول
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
