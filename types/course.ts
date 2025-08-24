import { PaginationOptions } from ".";

export interface ICourse {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: string;
  instructor_id: number;
  is_active: 0 | 1;
  image: string;
  study_year_id: number;
  created_at: Date;
  updated_at: Date;

  // Additional UI properties
  views?: number;
  sales?: number;
  semester?: number;
  average_rating?: number;
  completion_rate?: number;
  instructor_name?: string;
  total_lessons?: number;
  total_units?: number;
  duration_hours?: number;
  learning_outcomes?: string[];
  semester_id?: number;
  brief?: string;
}

export interface IDetailedCourse extends ICourse {
  chapters: IUnit[];
}

export interface ILesson {
  id: number;
  title: string;
  chapter_id: number;
  video_url: string;
  external_provider: string;
  attachment_path: string | null;
  is_free: 0 | 1;
  created_at: Date;
  updated_at: Date;
  order: number;
  
  // Additional properties for UI
  description?: string;
  duration_minutes?: number;
  is_completed?: boolean;
  unit_id?: number;
}

export interface UpdateUnitsSortDto {
  courseId: number;
  items: Array<{ id: number; order: number }>;
}

export interface UpdateItemsSortDto {
  courseId: number;
  unitId: number;
  items: Array<{ id: number; type: "lecture" | "exam"; order: number }>;
}

export interface IExam {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
  total_questions: number;
  passing_score: number;
  max_attempts: number;
  order: number;
  is_active: boolean;
  unit_id: number;
  created_at: string;
  updated_at: string;
}

export interface IUnit {
  id: number;
  title: string;
  order: number;
  lectures: ILesson[];
  exams: IExam[];
  // total_lessons: number;
  // total_exams: number;
  // total_duration: number;
  // is_active: boolean;
}

export interface IQuestion {
  id: number;
  question_text: string;
  question_image?: string;
  explanation?: string;
  level?: string; // Add this property to fix linter errors
  exam_id: number;
  answers?: IAnswer[];
  created_at: string;
  updated_at: string;
}

export interface IAnswer {
  id: number;
  answer_text: string;
  answer_image?: string;
  is_correct: boolean;
  question_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateUnitDto {
  title: string;
  description: string;
  order: number;
  course_id: number;
  is_active: boolean;
}

export interface UpdateUnitDto {
  title?: string;
  description?: string;
  order?: number;
  is_active?: boolean;
}

// Exam DTOs
export interface CreateExamDto {
  title: string;
  can_resume: boolean;
  show_answers_after_finish: boolean;
  start_date: string;
  end_date: string;
  course_id: number;
  chapter_id: number;
}

export interface UpdateExamDto {
  title?: string;
  can_resume?: boolean;
  show_answers_after_finish?: boolean;
  start_date?: string;
  end_date?: string;
}

// Question DTOs
export interface CreateQuestionDto {
  question_text: string;
  question_image?: string;
  explanation?: string;
  level?: string;
  exam_id: number;
  answers: CreateAnswerDto[];
}

export interface UpdateQuestionDto {
  question_text?: string;
  question_image?: string;
  explanation?: string;
  level?: string;
  answers?: UpdateAnswerDto[];
}

export interface CreateAnswerDto {
  answer_text: string;
  answer_image?: string;
  is_correct: boolean;
}

export interface UpdateAnswerDto {
  id?: number;
  answer_text?: string;
  answer_image?: string;
  is_correct?: boolean;
}

export interface CreateLectureDto {
  title: string;
  video_url: string;
  external_provider: string;
  is_free: boolean;
  course_id: number;
  chapter_id: number;
}

export interface UpdateLectureDto {
  title?: string;
  video_url?: string;
  external_provider?: string;
  is_free?: boolean;
}
