// src/types/data.type.ts

export interface CurriculumItem {
  grade_id: number;
  grade_name: string;
  subject_id: number;
  subject_name: string;
  chapter_id: number | null;
  chapter_name: string | null;
}

export interface GradeItem {
  id: number;
  name: string;
}

export interface SubjectItem {
  id: number;
  name: string;
}

export interface ExamItem {
  exam_id: string;
  title: string;
  description: string;
  total_questions: number;
  duration_minutes: number;
}

export interface ChapterItem {
  chapter_id: number | string;
  chapter_name: string;
  grade_id: number;
  subject_id: number;
}