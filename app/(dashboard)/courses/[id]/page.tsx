"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { ICourse, IUnit, ILesson, IExam } from "@/types/course";
import { CourseHeader } from "@/components/courses/CourseHeader";
import { AddEditUnitDialog } from "@/components/courses/AddEditUnitDialog";
import { SortableUnit } from "@/components/courses/SortableUnit";
import { SortableLessons } from "@/components/courses/SortableLessons";
import { SortableLesson } from "@/components/courses/SortableLesson";
import { Card } from "@/components/ui/card";
import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  Edit,
  Eye,
  FileText,
  GripVertical,
  MoreVertical,
  Play,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Sample data
const sampleLessons: ILesson[] = [
  {
    id: 1,
    title: "مقدمة في الأرقام",
    description: "تعلم الأرقام الأساسية والعمليات الحسابية البسيطة",
    duration_minutes: 45,
    video_url: "https://example.com/video1",
    order: 1,
    is_free: true,
    is_completed: false,
    unit_id: 1,
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-10T10:00:00Z",
  },
  {
    id: 2,
    title: "العمليات الحسابية الأساسية",
    description: "الجمع والطرح والضرب والقسمة",
    duration_minutes: 60,
    video_url: "https://example.com/video2",
    order: 2,
    is_free: false,
    is_completed: false,
    unit_id: 1,
    created_at: "2024-01-11T10:00:00Z",
    updated_at: "2024-01-11T10:00:00Z",
  },
  {
    id: 3,
    title: "حل المعادلات البسيطة",
    description: "تعلم كيفية حل المعادلات الخطية البسيطة",
    duration_minutes: 75,
    video_url: "https://example.com/video3",
    order: 1,
    is_free: false,
    is_completed: false,
    unit_id: 2,
    created_at: "2024-01-15T11:00:00Z",
    updated_at: "2024-01-15T11:00:00Z",
  },
  {
    id: 4,
    title: "المتباينات الخطية",
    description: "فهم وحل المتباينات الخطية",
    duration_minutes: 50,
    video_url: "https://example.com/video4",
    order: 2,
    is_free: false,
    is_completed: false,
    unit_id: 2,
    created_at: "2024-01-16T11:00:00Z",
    updated_at: "2024-01-16T11:00:00Z",
  },
];

const sampleExams: IExam[] = [
  {
    id: 1,
    title: "اختبار مقدمة في الرياضيات",
    description: "اختبار شامل لقياس فهم المفاهيم الأساسية",
    duration_minutes: 60,
    total_questions: 20,
    passing_score: 70,
    max_attempts: 3,
    order: 1,
    is_active: true,
    unit_id: 1,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    title: "اختبار الجبر الأساسي",
    description: "اختبار تطبيقي على المعادلات والمتباينات",
    duration_minutes: 45,
    total_questions: 15,
    passing_score: 75,
    max_attempts: 2,
    order: 1,
    is_active: true,
    unit_id: 2,
    created_at: "2024-01-20T14:00:00Z",
    updated_at: "2024-01-20T14:00:00Z",
  },
];

const sampleUnits: IUnit[] = [
  {
    id: 1,
    title: "مقدمة في الرياضيات",
    description: "الوحدة الأولى تغطي المفاهيم الأساسية في الرياضيات",
    order: 1,
    course_id: 1,
    lessons: sampleLessons.filter((lesson) => lesson.unit_id === 1),
    exams: sampleExams.filter((exam) => exam.unit_id === 1),
    total_lessons: 2,
    total_exams: 1,
    total_duration: 105,
    is_active: true,
    created_at: "2024-01-10T09:00:00Z",
    updated_at: "2024-01-10T09:00:00Z",
  },
  {
    id: 2,
    title: "الجبر الأساسي",
    description: "الوحدة الثانية تركز على المعادلات والمتباينات",
    order: 2,
    course_id: 1,
    lessons: sampleLessons.filter((lesson) => lesson.unit_id === 2),
    exams: sampleExams.filter((exam) => exam.unit_id === 2),
    total_lessons: 2,
    total_exams: 1,
    total_duration: 125,
    is_active: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
];

const sampleCourse: ICourse = {
  id: 1,
  title: "دورة الرياضيات الشاملة",
  description: "دورة متكاملة لتعلم الرياضيات من الأساسيات إلى المستوى المتقدم",
  price: "299.99",
  views: 1250,
  sales: 89,
  image: "/images/math-course.jpg",
  study_year_id: 1,
  semester: 1,
  is_active: true,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-15T12:00:00Z",
  average_rating: 4.7,
  completion_rate: 78,
  instructor_name: "د. أحمد محمد",
  total_lessons: 4,
  total_units: 2,
  duration_hours: 3.8,
};

export default function CourseUnitsPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [expandedUnits, setExpandedUnits] = useState<number[]>([]);
  const [units, setUnits] = useState<IUnit[]>(
    sampleUnits.sort((a, b) => a.order - b.order)
  );
  const [course] = useState<ICourse>(sampleCourse);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<IUnit | null>(null);
  const [unitForm, setUnitForm] = useState({
    title: "",
    description: "",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleUnit = (unitId: number) => {
    setExpandedUnits((prev) =>
      prev.includes(unitId)
        ? prev.filter((id) => id !== unitId)
        : [...prev, unitId]
    );
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}س ${mins}د`;
    }
    return `${mins}د`;
  };

  const handleAddUnit = () => {
    setEditingUnit(null);
    setUnitForm({ title: "", description: "" });
    setIsAddEditDialogOpen(true);
  };

  const handleEditUnit = (unit: IUnit) => {
    setEditingUnit(unit);
    setUnitForm({ title: unit.title, description: unit.description });
    setIsAddEditDialogOpen(true);
  };

  const handleSaveUnit = () => {
    if (!unitForm.title.trim()) {
      toast.error("يرجى إدخال اسم الوحدة");
      return;
    }

    if (editingUnit) {
      setUnits((prev) =>
        prev.map((unit) =>
          unit.id === editingUnit.id
            ? {
                ...unit,
                title: unitForm.title,
                description: unitForm.description,
              }
            : unit
        )
      );
      toast.success("تم تحديث الوحدة بنجاح");
    } else {
      const newUnit: IUnit = {
        id: Math.max(...units.map((u) => u.id)) + 1,
        title: unitForm.title,
        description: unitForm.description,
        order: units.length + 1,
        course_id: parseInt(courseId),
        lessons: [],
        exams: [],
        total_lessons: 0,
        total_exams: 0,
        total_duration: 0,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setUnits((prev) => [...prev, newUnit]);
      toast.success("تم إضافة الوحدة بنجاح");
    }

    setIsAddEditDialogOpen(false);
    setUnitForm({ title: "", description: "" });
    setEditingUnit(null);
  };

  const handleDeleteUnit = (unitId: number) => {
    setUnits((prev) => prev.filter((unit) => unit.id !== unitId));
    toast.success("تم حذف الوحدة بنجاح");
  };

  const handleDeleteLesson = (lessonId: number) => {
    setUnits((prev) =>
      prev.map((unit) => ({
        ...unit,
        lessons: unit.lessons.filter((lesson) => lesson.id !== lessonId),
        total_lessons: unit.lessons.filter((lesson) => lesson.id !== lessonId)
          .length,
      }))
    );
    toast.success("تم حذف الدرس بنجاح");
  };

  const handleDeleteExam = (examId: number) => {
    setUnits((prev) =>
      prev.map((unit) => ({
        ...unit,
        exams: unit.exams.filter((exam) => exam.id !== examId),
        total_exams: unit.exams.filter((exam) => exam.id !== examId).length,
      }))
    );
    toast.success("تم حذف الاختبار بنجاح");
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setUnits((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Update order values
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          order: index + 1,
        }));

        // Here you would typically make an API call to save the new order
        toast.success("تم تحديث ترتيب الوحدات بنجاح");

        return updatedItems;
      });
    }
  }

  const handleFormChange = (field: string, value: string) => {
    setUnitForm((prev) => ({ ...prev, [field]: value }));
  };

  const filteredUnits = units.filter(
    (unit) =>
      unit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalLessons = units.reduce((sum, unit) => sum + unit.total_lessons, 0);
  const totalExams = units.reduce((sum, unit) => sum + unit.total_exams, 0);
  const totalDuration = units.reduce(
    (sum, unit) => sum + unit.total_duration,
    0
  );

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <CourseHeader
        course={course}
        totalUnits={units.length}
        totalLessons={totalLessons}
        totalExams={totalExams}
        totalDuration={totalDuration}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddUnit={handleAddUnit}
        formatDuration={formatDuration}
      />

      {/* Units List with Drag and Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredUnits.map((u) => u.id)}
          strategy={verticalListSortingStrategy}
        >
          <Separator />
          <div>
            <h2 className="mt-4 mb-4 text-2xl font-semibold ps-2">
              إدارة الوحدات
            </h2>
            <div className="space-y-2 bg-gray-100 rounded-2xl p-4">
              {filteredUnits.map((unit) => (
                <SortableUnit
                  key={unit.id}
                  unit={unit}
                  courseId={courseId}
                  expandedUnits={expandedUnits}
                  toggleUnit={toggleUnit}
                  handleEditUnit={handleEditUnit}
                  handleDeleteUnit={handleDeleteUnit}
                  router={router}
                  formatDuration={formatDuration}
                  handleDeleteLesson={handleDeleteLesson}
                  handleDeleteExam={handleDeleteExam}
                />
              ))}
            </div>
          </div>
        </SortableContext>
      </DndContext>

      <AddEditUnitDialog
        isOpen={isAddEditDialogOpen}
        onOpenChange={setIsAddEditDialogOpen}
        editingUnit={editingUnit}
        onSave={handleSaveUnit}
      />
    </div>
  );
}
