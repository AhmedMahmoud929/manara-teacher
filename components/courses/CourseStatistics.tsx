"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Play, FileText, Clock } from "lucide-react";

interface CourseStatisticsProps {
  totalUnits: number;
  totalLessons: number;
  totalExams: number;
  totalDuration: number;
  formatDuration: (minutes: number) => string;
}

export function CourseStatistics({
  totalUnits,
  totalLessons,
  totalExams,
  totalDuration,
  formatDuration,
}: CourseStatisticsProps) {
  return (
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
  );
}
