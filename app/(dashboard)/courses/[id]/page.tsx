"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CourseHeader } from "@/components/courses/CourseHeader";
import { SortableUnit } from "@/components/courses/SortableUnit";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetSingleCourseQuery } from "@/redux/features/courses/coursesApi";
import CourseSkeleton from "@/components/courses/CourseSkeleton";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function CourseUnitsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.id);

  // State management
  const [searchTerm, setSearchTerm] = useState("");

  // API Queries
  const {
    data: courseData,
    isLoading,
    error,
  } = useGetSingleCourseQuery(courseId, {
    skip: !courseId,
  });

  // Use real data if available, fallback to sample data
  const course = courseData?.data;
  const units = courseData?.data.chapters || [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}س ${mins}د`;
    }
    return `${mins}د`;
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      // Handle drag and drop reordering
      toast.success("تم تحديث ترتيب الوحدات بنجاح");
    }
  }

  const filteredUnits = units.filter((unit) =>
    unit.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalLessons = units.reduce(
    (sum, unit) => sum + unit.lectures.length,
    0
  );
  const totalExams = units.reduce((sum, unit) => sum + unit.exams.length, 0);
  const totalDuration = 124;

  if (isLoading) return <CourseSkeleton />;

  if (error) {
    return (
      <div className="container mx-auto p-4 mt-4">
        <Card className="border-red-200 bg-red-50">
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-red-800 mb-2">
              حدث خطأ في تحميل الكورس
            </h2>

            <p className="text-red-600 mb-6">
              {"status" in error && error.status === 404
                ? "الكورس المطلوب غير موجود أو تم حذفه"
                : "فشل في تحميل بيانات الكورس. يرجى المحاولة مرة أخرى."}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2"
                variant="default"
              >
                <RefreshCw className="h-4 w-4" />
                إعادة المحاولة
              </Button>

              <Button
                onClick={() => router.push("/dashboard/courses")}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                العودة للكورسات
              </Button>
            </div>

            {process.env.NODE_ENV === "development" && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-red-700 hover:text-red-800">
                  تفاصيل الخطأ (للمطورين)
                </summary>
                <pre className="mt-2 p-3 bg-red-100 rounded text-xs text-red-800 overflow-auto">
                  {JSON.stringify(error, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </Card>
      </div>
    );
  }

  if (error || !course) return <div></div>;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <CourseHeader
        course={course}
        totalUnits={units.length}
        totalLessons={totalLessons}
        totalExams={totalExams}
        totalDuration={totalDuration}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        formatDuration={formatDuration}
      />

      <Separator />

      <div className="space-y-4 bg-gray-100 rounded-2xl p-4 mt-6">
        {filteredUnits.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            لا توجد وحدات متاحة
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredUnits.map((u) => u.id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredUnits.map((unit) => (
                <SortableUnit key={unit.id} unit={unit} courseId={courseId} />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
