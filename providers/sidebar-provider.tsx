"use client";

import { useState } from "react";
import { ReusableSidebar } from "@/components/shared/ReusableSidebar";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  ShoppingCart,
  Settings,
  LogOut,
  BadgeDollarSign,
  RectangleEllipsis,
  Ticket,
  Factory,
  CirclePercent,
  ChevronDown,
  MapPin,
  Globe,
  Building,
  BookAIcon,
  User,
  UserCircle2,
} from "lucide-react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { setIsSidebarOpen } from "@/redux/features/(waraqah)/dashboard/dashboardSlice";
import { logoutUser } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useGetDashboardStatsQuery } from "@/redux/features/(waraqah)/dashboard/dashboardApi";

export default function SidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarOpen } = useAppSelector((state) => state.dashboard);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { data: productsCount } = useGetDashboardStatsQuery("products");
  const { data: ordersCount } = useGetDashboardStatsQuery("orders");
  const { data: usersCount } = useGetDashboardStatsQuery("users");

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/auth/login?redirect=/dashboard");
  };

  const sidebarItems = [
    {
      title: "الرئيسية",
      path: "/",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      title: "الكورسات",
      path: "/courses",
      icon: <BookAIcon className="w-5 h-5" />,
      badge: usersCount?.data,
    },
    {
      title: "الطلبة",
      path: "/students",
      icon: <Users className="w-5 h-5" />,
      badge: usersCount?.data,
    },
    {
      title: "العروض",
      path: "/offers",
      icon: <BadgeDollarSign className="w-5 h-5" />,
    },
    {
      title: "الكوبونات",
      path: "/coupons",
      icon: <Ticket className="w-5 h-5" />,
    },
    {
      title: "الإشتراكات",
      path: "/subscriptions",
      icon: <CirclePercent className="w-5 h-5" />,
    },
    {
      title: "حسابي",
      path: "/profile",
      icon: <UserCircle2 className="w-5 h-5" />,
    },
    // {
    //   title: "الإعدادات",
    //   icon: <Settings className="w-5 h-5" />,
    //   isCollapsible: true,
    //   isOpen: isSettingsOpen,
    //   onClick: () => setIsSettingsOpen(!isSettingsOpen),
    //   endIcon: (
    //     <ChevronDown
    //       className={`w-4 h-4 transition-transform ${
    //         isSettingsOpen ? "rotate-180" : ""
    //       }`}
    //     />
    //   ),
    //   children: [
    //     {
    //       title: "النوافذ المنبثقة",
    //       path: "/dashboard/settings/popup",
    //       icon: <RectangleEllipsis className="w-4 h-4" />,
    //     },
    //     {
    //       title: "المحافظات",
    //       path: "/dashboard/settings/governates",
    //       icon: <Globe className="w-4 h-4" />,
    //     },
    //     {
    //       title: "المدن",
    //       path: "/dashboard/settings/cities",
    //       icon: <Building className="w-4 h-4" />,
    //     },
    //   ],
    // },
  ];

  const Logo = (
    <div className="relative w-7 h-7">
      <Image src={"/svgs/badge-check.svg"} alt="manara platform" fill />
    </div>
  );

  const Footer = (
    <div
      onClick={handleLogout}
      className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-red-50 cursor-pointer"
    >
      <LogOut className="w-5 h-5" />
      <span>تسجيل الخروج</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50" dir="rtl">
      <ReusableSidebar
        items={sidebarItems}
        logo={Logo}
        title="منصة منارة"
        direction="rtl"
        position="right"
        footer={Footer}
        collapsible={true}
        defaultCollapsed={false}
        onCollapsedChange={(val) => dispatch(setIsSidebarOpen(val))}
      />

      <main
        className={`min-h-screen p-4 md:p-8 transition-all duration-300 ${
          isSidebarOpen ? "md:mr-20" : "md:mr-64"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
