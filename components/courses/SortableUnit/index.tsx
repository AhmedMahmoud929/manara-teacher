"use client";

import React, { useState, useMemo } from "react";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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
  Edit2,
} from "lucide-react";
import { IUnit, ILesson, IExam } from "@/types/course";
import { AddLessonDialog } from "../AddLessonDialog";
import { AddExamDialog } from "../AddExamDialog";
import AddEditUnitDialog from "../AddEditUnitDialog";
import { useDeleteUnitMutation } from "@/redux/features/courses/coursesApi";
import { handleReqWithToaster } from "@/lib/handle-req-with-toaster";
import { DeleteConfirmationDialog } from "../../shared/DeleteConfirmationDialog";
import DropdownCustomItem from "../../shared/DropdownCustomItem";
import { toast } from "sonner";
import Link from "next/link";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableLesson } from "../SortableLesson";

type SortableItem = (ILesson | IExam) & { type: "lesson" | "exam" };

// Add these imports if you have lesson/exam update mutations
// import { useUpdateLessonMutation, useUpdateExamMutation } from "@/redux/features/courses/coursesApi";

export function SortableUnit({
  unit,
  courseId,
}: {
  unit: IUnit;
  courseId: number;
}) {
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

  const [expandedUnits, setExpandedUnits] = useState<number[]>([]);

  // Combine lessons and exams into a single sorted array
  const [sortedItems, setSortedItems] = useState<SortableItem[]>(() => {
    const lessons: SortableItem[] = unit.lectures.map((lesson) => ({
      ...lesson,
      type: "lesson" as const,
    }));
    const exams: SortableItem[] = unit.exams.map((exam) => ({
      ...exam,
      type: "exam" as const,
    }));

    return [...lessons, ...exams].sort((a, b) => a.order - b.order);
  });

  const [deleteUnit] = useDeleteUnitMutation();
  // Add these if you have them in your API:
  // const [updateLesson] = useUpdateLessonMutation();
  // const [updateExam] = useUpdateExamMutation();

  const toggleUnit = (unitId: number) => {
    setExpandedUnits((prev) =>
      prev.includes(unitId)
        ? prev.filter((id) => id !== unitId)
        : [...prev, unitId]
    );
  };

  const confirmDeleteUnit = (unitId: number) => {
    handleReqWithToaster("جاري حذف الوحدة...", async () => {
      await deleteUnit({
        courseId,
        unitId,
      }).unwrap();
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSortedItems((items) => {
        const oldIndex = items.findIndex(
          (item) => `${item.type}-${item.id}` === active.id
        );
        const newIndex = items.findIndex(
          (item) => `${item.type}-${item.id}` === over?.id
        );

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Update order values
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          order: index + 1,
        }));

        // Persist changes to backend using existing update endpoints
        const updatePromises = updatedItems.map(async (item) => {
          try {
            if (item.type === "lesson") {
              // Use your existing lesson update endpoint
              // Replace this with your actual lesson update mutation
              const response = await fetch(
                `/api/instructor/courses/${courseId}/units/${unit.id}/lessons/${item.id}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    ...item,
                    order: item.order,
                  }),
                }
              );

              if (!response.ok) {
                throw new Error("Failed to update lesson order");
              }
            } else {
              // Use your existing exam update endpoint
              // Replace this with your actual exam update mutation
              const response = await fetch(
                `/api/instructor/courses/${courseId}/units/${unit.id}/exams/${item.id}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    ...item,
                    order: item.order,
                  }),
                }
              );

              if (!response.ok) {
                throw new Error("Failed to update exam order");
              }
            }
          } catch (error) {
            console.error(`Failed to update ${item.type} order:`, error);
            toast.error(
              `فشل في تحديث ترتيب ${
                item.type === "lesson" ? "الدرس" : "الاختبار"
              }`
            );
            throw error;
          }
        });

        // Wait for all updates to complete
        Promise.all(updatePromises)
          .then(() => {
            toast.success("تم تحديث ترتيب المحتوى بنجاح");
          })
          .catch(() => {
            toast.error("فشل في تحديث بعض العناصر");
            // Optionally revert the local state on error
            // You might want to refetch the data here
          });

        return updatedItems;
      });
    }
  }

  // Update sortedItems when unit data changes
  React.useEffect(() => {
    const lessons: SortableItem[] = unit.lectures.map((lesson) => ({
      ...lesson,
      type: "lesson" as const,
    }));
    const exams: SortableItem[] = unit.exams.map((exam) => ({
      ...exam,
      type: "exam" as const,
    }));

    setSortedItems([...lessons, ...exams].sort((a, b) => a.order - b.order));
  }, [unit.lectures, unit.exams]);

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
                {unit.lectures.length ? (
                  <Badge
                    variant="secondary"
                    className="!py-1 rounded-md !text-xs font-medium"
                  >
                    {unit.lectures.length} دروس
                  </Badge>
                ) : null}
                {unit.exams.length ? (
                  <Badge variant="outline" className="!text-xs font-medium">
                    {unit.exams.length} اختبارات
                  </Badge>
                ) : null}
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
                <AddLessonDialog courseId={courseId} chapterId={unit.id}>
                  <DropdownCustomItem
                    icon={<Plus className="w-4 h-4" />}
                    text={"إضافة درس"}
                  />
                </AddLessonDialog>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <AddExamDialog courseId={courseId} chapterId={unit.id}>
                  <DropdownCustomItem
                    icon={<FileText className="w-4 h-4" />}
                    text={"إضافة اختبار"}
                  />
                </AddExamDialog>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <AddEditUnitDialog courseId={courseId} unitId={unit.id}>
                  <DropdownCustomItem
                    icon={<Edit2 className="w-3.5 h-3.5" />}
                    text="تعديل الوحدة"
                  />
                </AddEditUnitDialog>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <DeleteConfirmationDialog
                  onDelete={() => confirmDeleteUnit(unit.id)}
                  name="الوحدة"
                >
                  <DropdownCustomItem
                    variant="danger"
                    icon={<Trash2 className="w-4 h-4" />}
                    text={"حذف الوحدة"}
                  />
                </DeleteConfirmationDialog>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {expandedUnits.includes(unit.id) && (
        <div className="p-4">
          {/* Combined Content Section */}
          {sortedItems.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                المحتوى ({sortedItems.length})
              </h4>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sortedItems.map((item) => `${item.type}-${item.id}`)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {sortedItems.map((item) => (
                      <SortableLesson
                        key={`${item.type}-${item.id}`}
                        item={item}
                        chapterId={unit.id}
                        courseId={courseId}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          {/* Empty State */}
          {sortedItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>لا توجد دروس أو اختبارات في هذه الوحدة</p>
              <div className="flex justify-center gap-2 mt-3">
                <AddLessonDialog courseId={courseId} chapterId={unit.id}>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 ml-1" />
                    إضافة درس
                  </Button>
                </AddLessonDialog>
                <Link href={`/courses/${courseId}/units/${unit.id}/exams/new`}>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 ml-1" />
                    إضافة اختبار
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
