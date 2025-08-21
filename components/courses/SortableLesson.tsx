"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Edit, Trash2, Eye, GripVertical } from "lucide-react";
import { ILesson } from "@/types/course";

interface SortableLessonProps {
  lesson: ILesson;
  courseId: string;
  router: any;
  formatDuration: (minutes: number) => string;
  handleDeleteLesson: (lessonId: number) => void;
}

export function SortableLesson({
  lesson,
  courseId,
  router,
  formatDuration,
  handleDeleteLesson,
}: SortableLessonProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

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
        <Play className="w-4 h-4 text-blue-500" />
        <div>
          <p className="font-medium text-sm">{lesson.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="!text-xs">
              {formatDuration(lesson.duration_minutes)}
            </Badge>
            {lesson.is_free && (
              <Badge variant="secondary" className="rounded-md !py-1 !text-xs">
                مجاني
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            router.push(`/courses/${courseId}/lessons/${lesson.id}`)
          }
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDeleteLesson(lesson.id)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
