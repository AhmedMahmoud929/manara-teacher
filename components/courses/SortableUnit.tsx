"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronLeft,
  Edit,
  Trash2,
  Plus,
  FileText,
  MoreVertical,
  GripVertical,
  BookOpen,
} from "lucide-react";
import { IUnit } from "@/types/course";
import { SortableLessons } from "./SortableLessons";
import { ExamsList } from "./ExamsList";
import { AddLessonDialog } from "./AddLessonDialog";
import { AddExamDialog } from "./AddExamDialog";

interface SortableUnitProps {
  unit: IUnit;
  courseId: string;
  expandedUnits: number[];
  toggleUnit: (unitId: number) => void;
  handleEditUnit: (unit: IUnit) => void;
  handleDeleteUnit: (unitId: number) => void;
  router: any;
  formatDuration: (minutes: number) => string;
  handleDeleteLesson: (lessonId: number) => void;
  handleDeleteExam: (examId: number) => void;
}

export function SortableUnit({
  unit,
  courseId,
  expandedUnits,
  toggleUnit,
  handleEditUnit,
  handleDeleteUnit,
  router,
  formatDuration,
  handleDeleteLesson,
  handleDeleteExam,
}: SortableUnitProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: unit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`overflow-hidden ${isDragging ? "shadow-lg" : "shadow-none"}`}
    >
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab hover:cursor-grabbing p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleUnit(unit.id)}
              className="p-1"
            >
              {expandedUnits.includes(unit.id) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
            <div>
              <h3 className="font-semibold text-lg">{unit.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className="!py-1 rounded-md !text-xs font-medium"
                >
                  {unit.total_lessons} دروس
                </Badge>
                <Badge variant="outline" className="!text-xs font-medium">
                  {unit.total_exams} اختبارات
                </Badge>
                <Badge variant="outline" className="!text-xs font-medium">
                  {formatDuration(unit.total_duration)}
                </Badge>
                <Badge
                  variant={unit.is_active ? "default" : "secondary"}
                  className="!text-xs !font-medium"
                >
                  {unit.is_active ? "نشط" : "غير نشط"}
                </Badge>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <AddLessonDialog>
                  <div className="cursor-pointer flex-center gap-1.5 pl-1.5 pr-4 py-1 hover:bg-zinc-50 rounded-md">
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">إضافة درس</span>
                  </div>
                </AddLessonDialog>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <AddExamDialog>
                  <div className="cursor-pointer flex-center gap-2 pl-2 pr-4 py-1.5 hover:bg-zinc-50 rounded-md">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">إضافة اختبار</span>
                  </div>
                </AddExamDialog>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditUnit(unit)}>
                <Edit className="w-4 h-4" />
                تعديل الوحدة
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeleteUnit(unit.id)}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4" />
                حذف الوحدة
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {expandedUnits.includes(unit.id) && (
        <div className="p-4">
          {/* Lessons Section */}
          {unit.lessons.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                الدروس ({unit.lessons.length})
              </h4>
              <SortableLessons
                lessons={unit.lessons}
                courseId={courseId}
                unitId={unit.id}
                router={router}
                formatDuration={formatDuration}
                handleDeleteLesson={handleDeleteLesson}
              />
            </div>
          )}

          {/* Exams Section */}
          {unit.exams.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                الاختبارات ({unit.exams.length})
              </h4>
              <ExamsList
                exams={unit.exams}
                courseId={courseId}
                router={router}
                formatDuration={formatDuration}
                handleDeleteExam={handleDeleteExam}
              />
            </div>
          )}

          {/* Empty State */}
          {unit.lessons.length === 0 && unit.exams.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>لا توجد دروس أو اختبارات في هذه الوحدة</p>
              <div className="flex justify-center gap-2 mt-3">
                <AddLessonDialog>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 ml-1" />
                    إضافة درس
                  </Button>
                </AddLessonDialog>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(
                      `/courses/${courseId}/units/${unit.id}/exams/new`
                    )
                  }
                >
                  <Plus className="w-4 h-4 ml-1" />
                  إضافة اختبار
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
