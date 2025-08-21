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
} from "lucide-react";
import { IExam, IQuestion, IAnswer } from "@/types/course";
import { AddQuestionDialog } from "@/components/courses/AddQuestionDialog";

// Sample exam data
const sampleExam: IExam = {
  id: 1,
  title: "اختبار مقدمة في الرياضيات",
  description: "اختبار شامل لقياس فهم المفاهيم الأساسية في الرياضيات",
  duration_minutes: 60,
  total_questions: 20,
  passing_score: 70,
  max_attempts: 3,
  order: 1,
  is_active: true,
  unit_id: 1,
  created_at: "2024-01-15T10:00:00Z",
  updated_at: "2024-01-15T10:00:00Z",
};

// Sample questions data
const sampleQuestions: (IQuestion & { answers: IAnswer[] })[] = [
  {
    id: 1,
    question_text: "ما هو ناتج 2 + 2؟",
    level: "easy",
    question_image: undefined,
    explanation: "عملية جمع بسيطة",
    exam_id: 1,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    answers: [
      {
        id: 1,
        answer_text: "3",
        answer_image: undefined,
        is_correct: false,
        question_id: 1,
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
      },
      {
        id: 2,
        answer_text: "4",
        answer_image: undefined,
        is_correct: true,
        question_id: 1,
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
      },
      {
        id: 3,
        answer_text: "5",
        answer_image: undefined,
        is_correct: false,
        question_id: 1,
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
      },
    ],
  },
];

export default function ExamDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const examId = params.examId as string;

  const [exam] = useState<IExam>(sampleExam);
  const [questions, setQuestions] =
    useState<(IQuestion & { answers: IAnswer[] })[]>(sampleQuestions);
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<
    (IQuestion & { answers: IAnswer[] }) | undefined
  >(undefined);

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

  const handleDeleteQuestion = (questionId: number) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const handleEditQuestion = (question: IQuestion & { answers: IAnswer[] }) => {
    setEditingQuestion(question);
    setIsAddQuestionOpen(true);
  };

  const handleAddQuestion = (questionData: any) => {
    if (editingQuestion) {
      // Update existing question
      const updatedQuestion: IQuestion & { answers: IAnswer[] } = {
        ...editingQuestion,
        question_text: questionData.question_text,
        level: questionData.level,
        question_image: questionData.question_image,
        explanation: questionData.explanation,
        updated_at: new Date().toISOString(),
        answers: questionData.answers.map((answer: any, index: number) => ({
          id: editingQuestion.answers[index]?.id || Date.now() + index,
          answer_text: answer.answer_text,
          answer_image: answer.answer_image,
          is_correct: answer.is_correct,
          question_id: editingQuestion.id,
          created_at:
            editingQuestion.answers[index]?.created_at ||
            new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })),
      };

      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === editingQuestion.id ? updatedQuestion : q
        )
      );
      setEditingQuestion(undefined);
    } else {
      // Add new question
      const newQuestion: IQuestion & { answers: IAnswer[] } = {
        id: Date.now(),
        question_text: questionData.question_text,
        level: questionData.level,
        question_image: questionData.question_image,
        explanation: questionData.explanation,
        exam_id: questionData.exam_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        answers: questionData.answers.map((answer: any, index: number) => ({
          id: Date.now() + index,
          answer_text: answer.answer_text,
          answer_image: answer.answer_image,
          is_correct: answer.is_correct,
          question_id: Date.now(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })),
      };

      setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
    }

    setIsAddQuestionOpen(false);
    console.log(
      editingQuestion
        ? "Question updated successfully"
        : "Question added successfully"
    );
  };

  const handleDialogClose = () => {
    setIsAddQuestionOpen(false);
    setEditingQuestion(undefined);
  };

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
                <p className="text-lg font-semibold">
                  {formatDuration(exam.duration_minutes)}
                </p>
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
                <p className="text-lg font-semibold">{exam.passing_score}%</p>
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
                <p className="text-lg font-semibold">{exam.max_attempts}</p>
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
            <Button
              onClick={() => setIsAddQuestionOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              إضافة سؤال
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {questions.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">لا توجد أسئلة في هذا الامتحان بعد</p>
              <Button
                onClick={() => setIsAddQuestionOpen(true)}
                className="mt-4"
              >
                إضافة أول سؤال
              </Button>
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
                        >
                          <Trash2 className="w-4 h-4" />
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
                      {question.answers.map((answer, answerIndex) => (
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

      {/* Add Question Dialog */}
      <AddQuestionDialog
        isOpen={isAddQuestionOpen}
        onOpenChange={handleDialogClose}
        onSave={handleAddQuestion}
        editingQuestion={editingQuestion}
        examId={parseInt(examId)}
      />
    </div>
  );
}
