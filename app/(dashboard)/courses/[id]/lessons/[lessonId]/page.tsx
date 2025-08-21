"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Play,
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
} from "lucide-react";
import { ILesson, ICourse } from "@/types/course";
import { Progress } from "@/components/ui/progress";
import { AddLessonDialog } from "@/components/courses/AddLessonDialog";

// Sample data for demonstration
const sampleLesson: ILesson = {
  id: 1,
  title: "مقدمة في الأرقام",
  description:
    "تعلم الأرقام الأساسية والعمليات الحسابية البسيطة. في هذا الدرس سنتعلم كيفية التعامل مع الأرقام من 1 إلى 100 والعمليات الأساسية مثل الجمع والطرح والضرب والقسمة.",
  duration_minutes: 45,
  video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  order: 1,
  is_free: true,
  is_completed: false,
  unit_id: 1,
  created_at: "2024-01-10T10:00:00Z",
  updated_at: "2024-01-10T10:00:00Z",
};

const sampleCourse: ICourse = {
  id: 1,
  title: "الرياضيات للمبتدئين",
  description: "دورة شاملة في الرياضيات",
  price: "99.99",
  views: 1250,
  sales: 89,
  image: "/images/course1.jpg",
  study_year_id: 1,
  semester: 1,
  is_active: true,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  average_rating: 4.5,
  completion_rate: 78,
  instructor_name: "أحمد محمد",
  total_lessons: 24,
  total_units: 6,
  duration_hours: 18,
};

// Sample analytics data
const lessonAnalytics = {
  totalStudents: 156,
  completedStudents: 134,
  averageWatchTime: 38, // minutes
  averageRating: 4.3,
  totalComments: 23,
  engagementRate: 86,
  dropOffPoints: [
    { time: "5:30", percentage: 15 },
    { time: "18:45", percentage: 28 },
    { time: "32:10", percentage: 12 },
  ],
};

interface LessonDetailPageProps {
  params: {
    id: string;
    lessonId: string;
  };
}

export default function LessonDetailPage({ params }: LessonDetailPageProps) {
  const router = useRouter();
  const [lesson, setLesson] = useState<ILesson>(sampleLesson);
  const [course] = useState<ICourse>(sampleCourse);

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}س ${remainingMinutes}د`;
    }
    return `${minutes}د`;
  };

  const handleEditLesson = (updatedLesson: ILesson) => {
    setLesson(updatedLesson);
    console.log("Lesson updated:", updatedLesson);
    // Here you would typically call your API to update the lesson
  };

  const handleDeleteLesson = () => {
    if (confirm("هل أنت متأكد من حذف هذا الدرس؟")) {
      console.log(`Deleting lesson ${lesson.id}`);
      router.push(`/courses/${params.id}`);
    }
  };

  const handleViewStudentProgress = () => {
    router.push(`/courses/${params.id}/lessons/${params.lessonId}/students`);
  };

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

  const completionRate =
    (lessonAnalytics.completedStudents / lessonAnalytics.totalStudents) * 100;

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
            <p className="text-muted-foreground">{course.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AddLessonDialog editingLesson={lesson}>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              تعديل
            </Button>
          </AddLessonDialog>
          <Button
            onClick={handleDeleteLesson}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            حذف
          </Button>
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
                    src={getVideoEmbedUrl(lesson.video_url)}
                    title={lesson.title}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow pt-4">
              <CardContent className="px-6">
                <div className="flex flex-col items-start justify-between">
                  <div>
                    <p className="text-3xl font-bold text-blue-600">
                      {lessonAnalytics.totalStudents}
                    </p>
                    <p className="text-sm font-medium text-muted-foreground mt-1">
                      إجمالي الطلاب
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      +12 هذا الأسبوع
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow pt-4">
              <CardContent className="px-6">
                <div className="flex flex-col items-start justify-between">
                  <div>
                    <p className="text-3xl font-bold text-green-600">
                      {completionRate.toFixed(0)}%
                    </p>
                    <p className="text-sm font-medium text-muted-foreground mt-1">
                      معدل الإكمال
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div
                        className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow pt-4">
              <CardContent className="px-6">
                <div className="flex flex-col items-start justify-between">
                  <div>
                    <p className="text-3xl font-bold text-orange-600">
                      {lessonAnalytics.averageWatchTime}د
                    </p>
                    <p className="text-sm font-medium text-muted-foreground mt-1">
                      متوسط المشاهدة
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      من أصل {lesson.duration_minutes}د
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500 hover:shadow-md transition-shadow pt-4">
              <CardContent className="px-6">
                <div className="flex flex-col items-start justify-between">
                  <div>
                    <p className="text-3xl font-bold text-yellow-600">
                      {lessonAnalytics.averageRating}
                    </p>
                    <p className="text-sm font-medium text-muted-foreground mt-1">
                      متوسط التقييم
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${
                            star <= lessonAnalytics.averageRating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

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
                {lesson.description}
              </p>
            </CardContent>
          </Card>

          {/* Comments & Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                التعليقات والملاحظات
                <Badge variant="secondary">
                  {lessonAnalytics.totalComments}
                </Badge>
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
                  <span>{formatDuration(lesson.duration_minutes)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">الترتيب:</span>
                <span>الدرس {lesson.order}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">النوع:</span>
                <Badge variant={lesson.is_free ? "secondary" : "default"}>
                  {lesson.is_free ? "مجاني" : "مدفوع"}
                </Badge>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">تاريخ الإنشاء:</span>
                <span className="text-sm">
                  {new Date(lesson.created_at).toLocaleDateString("ar-SA")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">آخر تحديث:</span>
                <span className="text-sm">
                  {new Date(lesson.updated_at).toLocaleDateString("ar-SA")}
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

          {/* Course Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>إحصائيات الدورة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>إجمالي الطلاب</span>
                  <span>{course.sales}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>معدل الإكمال</span>
                  <span>{course.completion_rate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${course.completion_rate}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>التقييم العام</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{course.average_rating}</span>
                  </div>
                </div>
              </div>
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
