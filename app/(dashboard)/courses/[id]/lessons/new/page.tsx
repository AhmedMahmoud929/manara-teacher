"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddLessonDialog } from "@/components/courses/AddLessonDialog";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";

interface LessonFormData {
  title: string;
  video_url: string;
  external_provider: string;
  is_free: boolean;
}

export default function NewLessonPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveLesson = async (data: LessonFormData) => {
    setIsLoading(true);
    try {
      // Here you would make an API call to save the lesson
      console.log("Saving lesson:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("تم إضافة الدرس بنجاح");
      router.push(`/courses/${params.id}`);
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة الدرس");
      console.error("Error saving lesson:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    router.push(`/courses/${params.id}`);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/courses/${params.id}`)}
        >
          <ArrowLeft className="h-4 w-4 ml-2" />
          العودة للدورة
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            إضافة درس جديد
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            استخدم النموذج أدناه لإضافة درس جديد إلى الدورة
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 ml-2" />
            إضافة درس
          </Button>
        </CardContent>
      </Card>

      <AddLessonDialog
        isOpen={isDialogOpen}
        onOpenChange={handleDialogClose}
        editingLesson={null}
        onSave={handleSaveLesson}
      />
    </div>
  );
}
