import { PaginationOptions } from "./(waraqah)";

export interface ICourse {
  id: number;
  title: string;
  description: string;
  price: string;
  views: number;
  sales: number;
  image: string;
  study_year_id: number;
  semester: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // New fields
  average_rating: number;
  completion_rate: number;
  instructor_name: string;
  total_lessons: number;
  total_units: number;
  duration_hours: number;
}

export interface ILesson {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
  video_url?: string;
  order: number;
  is_free: boolean;
  is_completed: boolean;
  unit_id: number;
  created_at: string;
  updated_at: string;
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
  description: string;
  order: number;
  course_id: number;
  lessons: ILesson[];
  exams: IExam[];
  total_lessons: number;
  total_exams: number;
  total_duration: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductDto {
  name: string;
  description: string | null;
  price: string;
  category_id: number;
  year: number;
  semester: number;

  stock: number;
  available_stock: number;

  priority: number;
  is_best_seller: number;

  image: File;
}

export interface ProductFilterOptions extends PaginationOptions {
  year?: string;
  category_id?: string;
  price?: string;
}

export interface IFeaturedProduct {
  id: number;
  name: string;
  image: string;
  stock: number;
  available_stock: number;
  discount_percentage: string;
  in_stock: number;
  is_favorite: boolean;
}

export interface IQuestion {
  id: number;
  question_text: string;
  level: string; // easy, medium, hard
  question_image?: string;
  explanation?: string;
  exam_id: number;
  answers?: IAnswer[]; // Add this line
  created_at: string;
  updated_at: string;
}

export interface IAnswer {
  id: number;
  answer_text: string;
  answer_image?: string;
  is_correct: boolean; // 1 for correct, 0 for incorrect
  question_id: number;
  created_at: string;
  updated_at: string;
}
