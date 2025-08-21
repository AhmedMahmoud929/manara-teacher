"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { ICourse } from "@/types/course";
import { CourseStatistics } from "./CourseStatistics";
import { Form } from "../ui/form";
import TextFormEle from "../ui/form/text-form-element";
import { useForm } from "react-hook-form";

interface CourseHeaderProps {
  course: ICourse;
  totalUnits: number;
  totalLessons: number;
  totalExams: number;
  totalDuration: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddUnit: () => void;
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
  onAddUnit,
  formatDuration,
}: CourseHeaderProps) {
  const form = useForm();
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-600 mt-2">{course.description}</p>
        </div>
        <Button onClick={onAddUnit} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          إضافة وحدة جديدة
        </Button>
      </div>

      <CourseStatistics
        totalUnits={totalUnits}
        totalLessons={totalLessons}
        totalExams={totalExams}
        totalDuration={totalDuration}
        formatDuration={formatDuration}
      />

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
