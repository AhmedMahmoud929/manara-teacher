"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Clock,
  FileText,
  Plus,
  Edit,
  Trash2,
  Users,
  Target,
  RotateCcw,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { IQuestion, IAnswer } from "@/types/course";
import { AddQuestionDialog } from "@/components/courses/AddQuestionDialog";
import {
  useGetSingleExamQuery,
  useGetExamQuestionsQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} from "@/redux/features/exams/examsApi";
import { toast } from "sonner";

export default function ExamDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = parseInt(params.id as string);
  const chapterExamIds = params.chapterExamIds as string;
  const chapterId = parseInt(chapterExamIds.split("-")[0]);
  const examId = parseInt(chapterExamIds.split("-")[1]);

  // Check if courseId is valid
  if (isNaN(courseId)) {
    return (
      <div className="container mx-auto px-4 py-6">
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
              <ArrowLeft className="h-4 w-4" />
              العودة للدورات
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if chapterExamIds format is valid
  if (!chapterExamIds || !chapterExamIds.includes("-")) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">
              معرف الفصل أو الامتحان غير صحيح
            </h2>
            <p className="text-red-600 text-center mb-6">
              تنسيق معرف الفصل والامتحان غير صالح. يجب أن يكون بالتنسيق:
              فصل-امتحان
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
  if (isNaN(chapterId) || isNaN(examId)) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">
              معرف الفصل أو الامتحان غير صالح
            </h2>
            <p className="text-red-600 text-center mb-6">
              معرف الفصل أو الامتحان يجب أن يكون رقماً صالحاً
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

  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<
    (IQuestion & { answers: IAnswer[] }) | undefined
  >(undefined);

  // API hooks
  const {
    data: examData,
    isLoading: examLoading,
    error: examError,
  } = useGetSingleExamQuery({ courseId, chapterId, examId });

  const {
    data: questionsData,
    isLoading: questionsLoading,
    error: questionsError,
  } = useGetExamQuestionsQuery({ courseId, chapterId, examId });

  const [deleteQuestion, { isLoading: isDeleting }] =
    useDeleteQuestionMutation();

  const exam = examData?.data;
  const questions = questionsData?.data || [];

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} ساعة ${mins > 0 ? `و ${mins} دقيقة` : ""}`;
    }
    return `${mins} دقيقة`;
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case "easy":
        return "سهل";
      case "medium":
        return "متوسط";
      case "hard":
        return "صعب";
      default:
        return level;
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    try {
      await deleteQuestion({
        courseId,
        chapterId,
        examId,
        questionId,
      }).unwrap();
      toast.success("تم حذف السؤال بنجاح");
    } catch (error) {
      toast.error("فشل في حذف السؤال");
    }
  };

  const handleEditQuestion = (question: IQuestion & { answers: IAnswer[] }) => {
    setEditingQuestion(question);
    setIsAddQuestionOpen(true);
  };

  if (examLoading || questionsLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="mr-2">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  if (examError || !exam) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-8">
          <p className="text-red-600">حدث خطأ في تحميل بيانات الامتحان</p>
          <Button
            onClick={() => router.push(`/courses/${courseId}`)}
            className="mt-4"
          >
            العودة للكورس
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/courses/${courseId}`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          العودة للكورس
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{exam.title}</h1>
          <p className="text-gray-600 text-sm">{exam.description}</p>
        </div>
      </div>

      {/* Exam Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                {/* <p className="text-lg font-semibold">{formatDuration(0)}</p> */}
                <p className="text-lg font-semibold">-</p>
                <p className="text-sm text-gray-600">مدة الامتحان</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{questions.length}</p>
                <p className="text-sm text-gray-600">عدد الأسئلة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">-</p>
                <p className="text-sm text-gray-600">درجة النجاح</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <RotateCcw className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">-</p>
                <p className="text-sm text-gray-600">المحاولات المسموحة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Questions Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              أسئلة الامتحان
            </CardTitle>
            {questions.length > 0 ? (
              <AddQuestionDialog
                chapterId={chapterId}
                courseId={courseId}
                examId={examId}
              >
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  إضافة سؤال
                </Button>
              </AddQuestionDialog>
            ) : null}
          </div>
        </CardHeader>
        <CardContent>
          {questionsError ? (
            <div className="text-center py-8">
              <p className="text-red-600">حدث خطأ في تحميل الأسئلة</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">لا توجد أسئلة في هذا الامتحان بعد</p>
              <AddQuestionDialog
                chapterId={chapterId}
                courseId={courseId}
                examId={examId}
              >
                <div>
                  <Button className="mt-4">
                    <Plus className="w-4 h-4" />
                    إضافة أول سؤال
                  </Button>
                </div>
              </AddQuestionDialog>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <Card key={question.id} className="border-l-4">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                          السؤال {index + 1}
                        </span>
                        {question.level && (
                          <Badge className={getLevelBadgeColor(question.level)}>
                            {getLevelText(question.level)}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditQuestion(question)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="text-red-600 hover:text-red-700"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <p className="text-gray-900 font-medium mb-3">
                      {question.question_text}
                    </p>

                    {question.question_image && (
                      <div className="mb-3">
                        <img
                          src={question.question_image}
                          alt="صورة السؤال"
                          className="max-w-xs rounded-lg border"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">
                        الخيارات:
                      </p>
                      {question.answers?.map((answer, answerIndex) => (
                        <div
                          key={answer.id}
                          className={`flex items-center gap-2 p-2 rounded-lg border ${
                            answer.is_correct
                              ? "bg-green-50 border-green-200"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <span className="text-sm font-medium text-gray-600">
                            {String.fromCharCode(65 + answerIndex)}.
                          </span>
                          <span className="flex-1">{answer.answer_text}</span>
                          {answer.is_correct && (
                            <Badge variant="default" className="bg-green-600">
                              الإجابة الصحيحة
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>

                    {question.explanation && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800 mb-1">
                          التفسير:
                        </p>
                        <p className="text-sm text-blue-700">
                          {question.explanation}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
