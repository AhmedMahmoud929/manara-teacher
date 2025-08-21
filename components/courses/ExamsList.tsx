"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Edit, Trash2, Eye } from "lucide-react";
import { IExam } from "@/types/course";

interface ExamsListProps {
  exams: IExam[];
  courseId: string;
  router: any;
  formatDuration: (minutes: number) => string;
  handleDeleteExam: (examId: number) => void;
}

export function ExamsList({
  exams,
  courseId,
  router,
  formatDuration,
  handleDeleteExam,
}: ExamsListProps) {
  return (
    <div className="space-y-2">
      {exams.map((exam) => (
        <div
          key={exam.id}
          className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-green-500" />
            <div>
              <p className="font-medium text-sm">{exam.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="!text-xs">
                  {formatDuration(exam.duration_minutes)}
                </Badge>
                <Badge variant="outline" className="!text-xs">
                  {exam.total_questions} سؤال
                </Badge>
                <Badge variant="outline" className="!text-xs">
                  {exam.passing_score}% للنجاح
                </Badge>
                <Badge
                  variant={exam.is_active ? "default" : "secondary"}
                  className="!text-xs"
                >
                  {exam.is_active ? "نشط" : "غير نشط"}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                router.push(`/courses/${courseId}/exams/${exam.id}`)
              }
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteExam(exam.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
