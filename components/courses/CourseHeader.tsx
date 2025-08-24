"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, FileText, Play, Plus, Search } from "lucide-react";
import { ICourse } from "@/types/course";
import { Form } from "../ui/form";
import TextFormEle from "../ui/form/text-form-element";
import { useForm } from "react-hook-form";
import AddEditUnitDialog from "./AddEditUnitDialog";
import { Card, CardContent } from "../ui/card";

interface CourseHeaderProps {
  course: ICourse;
  totalUnits: number;
  totalLessons: number;
  totalExams: number;
  totalDuration: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  formatDuration: (minutes: number) => string;
}

export function CourseHeader({
  course,
  totalUnits,
  totalLessons,
  totalExams,
  totalDuration,
  searchTerm,
  onSearchChange,
  formatDuration,
}: CourseHeaderProps) {
  const form = useForm();
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          <h2 className="flex items-center gap-2 text-xl mt-2">
            السعر : <pre>{course.price}ج.م</pre>
          </h2>
          <p className="mt-2">الوصف : {course.description}</p>
        </div>
        <AddEditUnitDialog courseId={course.id}>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            إضافة وحدة جديدة
          </Button>
        </AddEditUnitDialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalUnits}</p>
                <p className="text-sm text-gray-600">الوحدات</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Play className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalLessons}</p>
                <p className="text-sm text-gray-600">الدروس</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalExams}</p>
                <p className="text-sm text-gray-600">الاختبارات</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {formatDuration(totalDuration)}
                </p>
                <p className="text-sm text-gray-600">المدة الإجمالية</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* <div className="relative mb-6">
        <Form {...form}>
          <form
            action=""
            onSubmit={form.handleSubmit(() => {})}
            className="flex-center gap-2"
          >
            <TextFormEle
              className="flex-1"
              form={form}
              name="search"
              placeholder="يمكنك البحث هنا"
            />
          </form>
        </Form>
      </div> */}
    </div>
  );
}
