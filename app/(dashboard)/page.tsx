"use client";

import { useState, useEffect } from "react";
import { BookOpen, Users, FileText, Award } from "lucide-react";

import { StatCard } from "@/components/home/stat-card";
import { LineChartCard } from "@/components/home/line-chart-card";
import { PieChartCard } from "@/components/home/pie-chart-card";
import { useAppSelector } from "@/redux/app/hooks";
import {
  useGetDashboardStatsQuery,
  useGetOrdersChartQuery,
  useGetTopProductsStatsQuery,
} from "@/redux/features/(waraqah)/dashboard/dashboardApi";
import { Skeleton } from "@/components/ui/skeleton";
// import { DashboardHeader } from "@/components/shared/dashboard-header"

// Educational color palette
const COLORS = [
  "#3EB489", // Primary green
  "#2D8D6D", // Darker green
  "#1A664F", // Deep green
  "#4ECFA0", // Light green
  "#7ADCB5", // Pale green - Educational success color
];

const TIME_RANGES = [
  { value: "daily", label: "يومي" },
  { value: "monthly", label: "شهري" },
  { value: "quarterly", label: "ربع سنوي" },
];

const RefetchOnMountConfig = { refetchOnMountOrArgChange: true };

export default function Dashboard() {
  // States and Hooks
  const [timeRange, setTimeRange] = useState(TIME_RANGES[0].value);
  const { user } = useAppSelector((state) => state.auth);

  // Queries - These would need to be updated to fetch educational data
  const {
    data: coursesCount,
    isLoading: isCoursesLoading,
    isFetching: isCoursesFetching,
  } = useGetDashboardStatsQuery("orders", RefetchOnMountConfig);

  const {
    data: studentsCount,
    isLoading: isStudentsLoading,
    isFetching: isStudentsFetching,
  } = useGetDashboardStatsQuery("orders", RefetchOnMountConfig);

  const {
    data: assignmentsCount,
    isLoading: isAssignmentsLoading,
    isFetching: isAssignmentsFetching,
  } = useGetDashboardStatsQuery("orders", RefetchOnMountConfig);

  const {
    data: gradesAverage,
    isLoading: isGradesLoading,
    isFetching: isGradesFetching,
  } = useGetDashboardStatsQuery("orders", RefetchOnMountConfig);

  const {
    data: studentProgressChart,
    isLoading: isProgressChartLoading,
    isFetching: isProgressChartFetching,
  } = useGetOrdersChartQuery(timeRange as any, RefetchOnMountConfig);

  const {
    data: topPerformingStudents,
    isLoading: isTopStudentsLoading,
    isFetching: isTopStudentsFetching,
  } = useGetTopProductsStatsQuery(undefined, RefetchOnMountConfig);

  return (
    <div className="p-4 md:p-6 bg-background min-h-screen" dir="rtl">
      <div className="mb-10">
        <h1 className="text-36 md:text-44 font-bold">
          أهلاً وسهلاً أستاذ
          {/* FIXME: Use the real name here */}
          {true ? (
            <span className="ms-3 text-primary">أحمد!</span>
          ) : (
            <Skeleton className="w-20 h-8" />
          )}
        </h1>
        <p className="text-black/40 text-26">تابع تقدم طلابك وإدارة دروسك</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={BookOpen}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          value={coursesCount?.data}
          unit="دورة"
          label="عدد الدورات"
          isLoading={isCoursesLoading || isCoursesFetching}
        />
        <StatCard
          icon={Users}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          value={studentsCount?.data}
          unit="طالب"
          label="عدد الطلاب"
          isLoading={isStudentsLoading || isStudentsFetching}
        />
        <StatCard
          icon={FileText}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
          value={assignmentsCount?.data}
          unit="واجب"
          label="الواجبات المرسلة"
          isLoading={isAssignmentsLoading || isAssignmentsFetching}
        />
        <StatCard
          icon={Award}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
          value={gradesAverage?.data}
          unit="%"
          label="متوسط الدرجات"
          isLoading={isGradesLoading || isGradesFetching}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {isProgressChartLoading || isProgressChartFetching ? (
          <div className="flex flex-col col-span-2 h-[350px] border p-4 rounded-2xl">
            <div className="flex-between gap-20 mb-4">
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-44 h-12" />
            </div>
            <Skeleton className="w-full h-full" />
          </div>
        ) : studentProgressChart ? (
          <LineChartCard
            title="تقدم الطلاب"
            data={
              studentProgressChart.data.map((s: any) => ({
                name: s.date,
                value: Number(s.total),
              })) || []
            }
            timeRange={timeRange}
            timeRangesOption={TIME_RANGES}
            onTimeRangeChange={setTimeRange}
          />
        ) : (
          <div className="flex flex-col col-span-2 h-[350px] border p-4 rounded-2xl">
            <div className="flex items-center justify-between gap-20 mb-4">
              <h3 className="text-lg font-medium">تقدم الطلاب</h3>
              <div className="w-44 h-12 flex items-center justify-center">
                لا توجد بيانات
              </div>
            </div>
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              لا توجد بيانات متاحة
            </div>
          </div>
        )}

        {isTopStudentsLoading || isTopStudentsFetching ? (
          <div className="flex flex-col h-[350px] border p-4 gap-4 rounded-2xl">
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-56" />
            <Skeleton className="w-full h-6" />
          </div>
        ) : topPerformingStudents ? (
          <PieChartCard
            title="أفضل الطلاب أداءً"
            data={
              topPerformingStudents.data.map((s: any) => ({
                name: s.product_name, // This would be student name in real implementation
                value: s.percentage,
              })) || []
            }
            colors={COLORS}
          />
        ) : (
          <div className="flex flex-col h-[350px] border p-4 gap-4 rounded-2xl">
            <h3 className="text-lg font-medium">أفضل الطلاب أداءً</h3>
            <div className="w-full h-56 flex items-center justify-center text-gray-400">
              لا توجد بيانات متاحة
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
