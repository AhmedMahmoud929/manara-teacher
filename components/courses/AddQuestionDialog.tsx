"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormDescription } from "@/components/ui/form";
import { IQuestion, IAnswer } from "@/types/course";
import TextFormEle from "../ui/form/text-form-element";
import SelectFormEle from "../ui/form/select-form-element";
import { Plus, Trash2, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "../ui/switch";

// Zod schema for question validation
const questionSchema = z.object({
  question_text: z.string().min(1, "نص السؤال مطلوب"),
  question_image: z.any().optional(),
  explanation: z.string().optional(),
  answers: z
    .array(
      z.object({
        answer_text: z.string().min(1, "نص الإجابة مطلوب"),
        answer_image: z.any().optional(),
        is_correct: z.boolean(),
      })
    )
    .min(2, "يجب إضافة إجابتين على الأقل")
    .max(6, "الحد الأقصى 6 إجابات"),
});

type QuestionFormValues = z.infer<typeof questionSchema>;

interface AddQuestionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: QuestionFormValues & { exam_id: number }) => void;
  editingQuestion?: IQuestion;
  examId: number;
}

export function AddQuestionDialog({
  isOpen,
  onOpenChange,
  onSave,
  editingQuestion,
  examId,
}: AddQuestionDialogProps) {
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question_text: "",
      explanation: "",
      answers: [
        { answer_text: "", is_correct: false },
        { answer_text: "", is_correct: false },
      ],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "answers",
  });

  // Effect to populate form when editing
  useEffect(() => {
    if (editingQuestion && isOpen) {
      form.reset({
        question_text: editingQuestion.question_text || "",
        explanation: editingQuestion.explanation || "",
        answers:
          editingQuestion.answers && editingQuestion.answers.length > 0
            ? editingQuestion.answers.map((answer) => ({
                answer_text: answer.answer_text || "",
                is_correct: answer.is_correct || false,
                answer_image: undefined, // Reset file input for editing
              }))
            : [
                { answer_text: "", is_correct: false },
                { answer_text: "", is_correct: false },
              ],
      });
    } else if (!editingQuestion && isOpen) {
      // Reset form for adding new question
      form.reset({
        question_text: "",
        explanation: "",
        answers: [
          { answer_text: "", is_correct: false },
          { answer_text: "", is_correct: false },
        ],
      });
    }
  }, [editingQuestion, isOpen, form]);

  const handleSubmit = (data: QuestionFormValues) => {
    // Ensure at least one answer is marked as correct
    const hasCorrectAnswer = data.answers.some((answer) => answer.is_correct);
    if (!hasCorrectAnswer) {
      form.setError("answers", {
        type: "manual",
        message: "يجب تحديد إجابة صحيحة واحدة على الأقل",
      });
      return;
    }

    // Clear any previous errors
    form.clearErrors("answers");

    onSave({ ...data, exam_id: examId });
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.reset();
  };

  const addAnswer = () => {
    if (fields.length < 6) {
      append({ answer_text: "", is_correct: false });
    }
  };

  const removeAnswer = (index: number) => {
    if (fields.length > 2) {
      remove(index);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl text-start">
            {editingQuestion ? "تعديل السؤال" : "إضافة سؤال جديد"}
          </DialogTitle>
          <DialogDescription className="text-start">
            {editingQuestion
              ? "قم بتعديل بيانات السؤال أدناه"
              : "أدخل بيانات السؤال الجديد أدناه"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid gap-6 py-4">
              {/* Question Text */}
              <TextFormEle
                form={form}
                name="question_text"
                type="textarea"
                placeholder="اكتب نص السؤال هنا..."
                label="نص السؤال *"
                inputClassName="min-h-[100px]"
              />

              {/* Question Image Upload */}
              <FormField
                control={form.control}
                name="question_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>صورة السؤال (اختياري)</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                          className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 shadow-none file:text-sm file:bg-gray-100"
                        />
                        <Upload className="h-4 w-4 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Explanation */}
              <TextFormEle
                form={form}
                name="explanation"
                type="textarea"
                placeholder="اكتب شرح الإجابة هنا (اختياري)..."
                label="شرح الإجابة (اختياري)"
              />

              {/* Answers Section */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">الإجابات</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAnswer}
                    disabled={fields.length >= 6}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    إضافة إجابة
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">الإجابة {index + 1}</h4>
                        {fields.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAnswer(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid gap-3">
                        {/* Answer Text */}
                        <TextFormEle
                          form={form}
                          name={`answers.${index}.answer_text` as any}
                          placeholder={`اكتب الإجابة ${index + 1}...`}
                          label="نص الإجابة *"
                        />

                        <div className="grid grid-cols-2 gap-3">
                          {/* Answer Image */}
                          <FormField
                            control={form.control}
                            name={`answers.${index}.answer_image`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>صورة الإجابة (اختياري)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                      field.onChange(e.target.files?.[0])
                                    }
                                    className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-gray-100"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Is Correct */}
                          <FormField
                            control={form.control}
                            name={`answers.${index}.is_correct`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-sm">
                                    إجابة صحيحة
                                  </FormLabel>
                                  <FormDescription className="text-xs">
                                    هل هذه الإجابة صحيحة؟
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <DialogFooter className="gap-2">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "جاري الحفظ..."
                  : editingQuestion
                  ? "حفظ التغييرات"
                  : "إضافة السؤال"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                إلغاء
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
