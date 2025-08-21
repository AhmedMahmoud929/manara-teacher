"use client";

import React, { useState } from "react";
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
import { ILesson } from "@/types/course";
import { SortableLesson } from "./SortableLesson";

interface SortableLessonsProps {
  lessons: ILesson[];
  courseId: string;
  unitId: number;
  router: any;
  formatDuration: (minutes: number) => string;
  handleDeleteLesson: (lessonId: number) => void;
}

export function SortableLessons({
  lessons,
  courseId,
  unitId,
  router,
  formatDuration,
  handleDeleteLesson,
}: SortableLessonsProps) {
  const [sortedLessons, setSortedLessons] = useState(
    lessons.sort((a, b) => a.order - b.order)
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSortedLessons((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Update order values
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          order: index + 1,
        }));

        toast.success("تم تحديث ترتيب الدروس بنجاح");
        return updatedItems;
      });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sortedLessons.map((l) => l.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {sortedLessons.map((lesson) => (
            <SortableLesson
              key={lesson.id}
              lesson={lesson}
              courseId={courseId}
              router={router}
              formatDuration={formatDuration}
              handleDeleteLesson={handleDeleteLesson}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
