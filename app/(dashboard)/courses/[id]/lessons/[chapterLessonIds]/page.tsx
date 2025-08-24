"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Clock,
  Eye,
  Edit,
  Trash2,
  BookOpen,
  Users,
  BarChart3,
  Download,
  MessageSquare,
  Star,
  TrendingUp,
  Calendar,
  FileText,
  AlertTriangle,
  RefreshCw,
  Home,
} from "lucide-react";
import { ILesson, ICourse } from "@/types/course";
import { Progress } from "@/components/ui/progress";
import { AddLessonDialog } from "@/components/courses/AddLessonDialog";
import {
  useGetSingleLectureQuery,
  useGetSingleCourseQuery,
  useDeleteLectureMutation,
} from "@/redux/features/courses/coursesApi";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog";
import { handleReqWithToaster } from "@/lib/handle-req-with-toaster";

export default function LessonDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = parseInt(params.id as string);
  const chapterLessonIds = params.chapterLessonIds as string;
  const chapterId = parseInt(chapterLessonIds.split("-")[0]);
  const lectureId = parseInt(chapterLessonIds.split("-")[1]);

  // Check if courseId is valid
  if (isNaN(courseId)) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">
              معرف الدورة غير صحيح
            </h2>
            <p className="text-red-600 text-center mb-6">
              معرف الدورة المطلوب غير موجود أو غير صالح
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/courses")}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              العودة للدورات
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if chapterLessonIds format is valid
  if (!chapterLessonIds || !chapterLessonIds.includes("-")) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">
              معرف الفصل أو المحاضرة غير صحيح
            </h2>
            <p className="text-red-600 text-center mb-6">
              تنسيق معرف الفصل والمحاضرة غير صالح. يجب أن يكون بالتنسيق:
              فصل-محاضرة
            </p>
            <Button
              variant="outline"
              onClick={() => router.push(`/courses/${params.id}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              العودة للدورة
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if parsed IDs are valid numbers
  if (isNaN(chapterId) || isNaN(lectureId)) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">
              معرف الفصل أو المحاضرة غير صالح
            </h2>
            <p className="text-red-600 text-center mb-6">
              معرف الفصل أو المحاضرة يجب أن يكون رقماً صالحاً
            </p>
            <Button
              variant="outline"
              onClick={() => router.push(`/courses/${params.id}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              العودة للدورة
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // API Queries
  const {
    data: lessonResponse,
    isLoading,
    error,
    refetch: refetchLesson,
  } = useGetSingleLectureQuery({
    courseId,
    chapterId,
    lectureId,
  });
  const lesson = lessonResponse?.data;

  // API Mutations
  const [deleteLecture] = useDeleteLectureMutation();

  const formatDuration = (minutes?: number): string => {
    if (!minutes) return "غير محدد";
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}س ${remainingMinutes}د`;
    }
    return `${minutes}د`;
  };

  const handleDeleteLesson = () =>
    handleReqWithToaster("جاري حذف المحاضرة...", async () => {
      await deleteLecture({
        courseId,
        chapterId,
        lectureId,
      }).unwrap();

      toast.success("تم حذف الدرس بنجاح");
      router.push(`/courses/${courseId}`);
    });

  const getVideoEmbedUrl = (url: string): string => {
    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  // Loading state
  if (isLoading)
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-24" />
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="aspect-video w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-48" />
            </div>
          </div>
        </div>
      </div>
    );

  // Error state
  if (error || !lesson)
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">
              حدث خطأ في تحميل البيانات
            </h2>
            <p className="text-red-600 text-center mb-6">
              فشل في تحميل بيانات الدرس
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => refetchLesson()}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                إعادة المحاولة
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/courses")}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                العودة للدورات
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/courses/${params.id}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            العودة للدورة
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{lesson.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AddLessonDialog
            editingLesson={lesson}
            courseId={courseId}
            chapterId={lesson.chapter_id}
          >
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              تعديل
            </Button>
          </AddLessonDialog>
          <DeleteConfirmationDialog
            name="المحاضرة"
            onDelete={handleDeleteLesson}
          >
            <Button className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              حذف
            </Button>
          </DeleteConfirmationDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          {lesson.video_url && (
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={lesson.video_url}
                    title={lesson.title}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lesson Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                وصف الدرس
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {lesson.description || "لا يوجد وصف متاح لهذا الدرس."}
              </p>
            </CardContent>
          </Card>

          {/* Comments & Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                التعليقات والملاحظات
                <Badge variant="secondary">24</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">أ</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">أحمد محمد</p>
                      <p className="text-xs text-muted-foreground">منذ يومين</p>
                    </div>
                  </div>
                  <p className="text-sm">
                    شرح ممتاز ومفصل، لكن أعتقد أن الجزء الخاص بالقسمة يحتاج
                    توضيح أكثر.
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">س</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">سارة أحمد</p>
                      <p className="text-xs text-muted-foreground">
                        منذ 3 أيام
                      </p>
                    </div>
                  </div>
                  <p className="text-sm">
                    درس رائع! الأمثلة واضحة والشرح سهل الفهم.
                  </p>
                </div>

                <Button variant="outline" className="w-full">
                  عرض جميع التعليقات
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Lesson Info */}
          <Card>
            <CardHeader>
              <CardTitle>معلومات الدرس</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">المدة:</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <pre>{formatDuration(lesson.duration_minutes)}</pre>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">الترتيب:</span>
                <pre>{lesson.order || "غير متوفر"}</pre>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">النوع:</span>
                <Badge
                  className="!py-1 !text-sm"
                  variant={lesson.is_free ? "secondary" : "default"}
                >
                  {lesson.is_free ? "مجاني" : "مدفوع"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">مقدم الخدمة:</span>
                <Badge variant="outline">
                  {lesson.external_provider || "غير محدد"}
                </Badge>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">تاريخ الإنشاء:</span>
                <span className="text-sm">
                  {new Date(lesson.created_at).toLocaleDateString("en-SA")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">آخر تحديث:</span>
                <span className="text-sm">
                  {new Date(lesson.updated_at).toLocaleDateString("en-SA")}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                تصدير تقرير الدرس
              </Button>

              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                تحميل المواد التعليمية
              </Button>

              <Separator />

              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => router.push(`/courses/${params.id}`)}
              >
                <Eye className="h-4 w-4 mr-2" />
                عرض جميع الدروس
              </Button>
            </CardContent>
          </Card>

          {/* Navigation */}
          <Card>
            <CardHeader>
              <CardTitle>التنقل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled={lesson.order === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                الدرس السابق
              </Button>

              <Button variant="outline" className="w-full justify-start">
                الدرس التالي
                <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
