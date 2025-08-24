"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Trash2, Eye, GripVertical, FileText } from "lucide-react";
import { ILesson, IExam } from "@/types/course";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { handleReqWithToaster } from "@/lib/handle-req-with-toaster";
import { useDeleteLectureMutation } from "@/redux/features/courses/coursesApi";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "../../shared/DeleteConfirmationDialog";
import { useDeleteExamMutation } from "@/redux/features/exams/examsApi";

type SortableItem = (ILesson | IExam) & { type: "lesson" | "exam" };

export function SortableLesson({
  item,
  courseId,
  chapterId,
}: {
  item: SortableItem;
  courseId: number;
  chapterId: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `${item.type}-${item.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [deleteLecture] = useDeleteLectureMutation();
  const [deleteExam] = useDeleteExamMutation();

  const isLesson = item.type === "lesson";
  const lesson = isLesson ? (item as ILesson) : null;
  const exam = !isLesson ? (item as IExam) : null;

  const handleDeleteLesson = () =>
    handleReqWithToaster("جاري حذف المحاضرة...", async () => {
      await deleteLecture({
        courseId,
        chapterId,
        lectureId: item.id,
      }).unwrap();

      toast.success("تم حذف الدرس بنجاح");
    });

  const handleDeleteExam = () =>
    handleReqWithToaster("جاري حذف الاختبار...", async () => {
      await deleteExam({
        courseId,
        chapterId,
        examId: item.id,
      }).unwrap();
    });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors ${
        isDragging ? "shadow-lg bg-white" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab hover:cursor-grabbing p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        <div
          className={cn(
            "flex flex-col items-center justify-center size-14 rounded-full",
            isLesson ? "bg-cyan-100" : " bg-purple-100"
          )}
        >
          {isLesson ? (
            <Play className="w-4 h-4 text-cyan-500" />
          ) : (
            <FileText className="w-4 h-4 text-purple-500" />
          )}
          <span
            className={cn(
              "text-xs",
              isLesson ? "text-cyan-600" : "text-purple-600"
            )}
          >
            {isLesson ? "محاضرة" : "اختبار"}
          </span>
        </div>
        <div>
          <p className="font-medium text-sm">{item.title}</p>
          <div className="flex items-center gap-2 mt-1">
            {isLesson ? (
              <>
                {lesson?.is_free && (
                  <Badge
                    variant="secondary"
                    className="rounded-md !py-1 !text-xs"
                  >
                    مجاني
                  </Badge>
                )}
              </>
            ) : (
              <>
                <Badge variant="outline" className="!text-xs">
                  15 د
                </Badge>
                <Badge
                  variant="secondary"
                  className="rounded-md !py-1 !text-xs"
                >
                  12 سؤال
                </Badge>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <Link
          href={`/courses/${courseId}/${
            isLesson ? "lessons" : "exams"
          }/${chapterId}-${item.id}`}
        >
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
        </Link>

        <DeleteConfirmationDialog
          onDelete={isLesson ? handleDeleteLesson : handleDeleteExam}
          name={isLesson ? "المحاضرة" : "الاختبار"}
        >
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </DeleteConfirmationDialog>
      </div>
    </div>
  );
}
