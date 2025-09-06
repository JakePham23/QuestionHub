// src/types/exercise.type.ts

import { Difficulty, QuestionType, UserAnswer, UserAnswers } from './common.type';

/**
 * Định nghĩa các trạng thái của một bài tập.
 */
export type ExerciseStatus = 'not_started' | 'in_progress' | 'completed' | 'all';

/**
 * Định nghĩa cấu trúc dữ liệu cơ bản cho một bài tập.
 */
export interface Exercise {
    id: number;
    title: string;
    description: string;
    subject: string;
    grade: string;
    chapter: string;
    topic?: string;
    type: string;
    totalQuestions: number;
    status: ExerciseStatus;
    completedAt?: string;
}

/**
 * Định nghĩa cấu trúc dữ liệu cho một chủ đề bài tập.
 */
export interface TopicExerciseInfo {
    topic_id: number;
    topic_name: string;
    topic_description: string;
    subject_name: string;
    grade_name: string;
    chapter_id: number;
    chapter_name: string;
}

/**
 * Định nghĩa cấu trúc dữ liệu cho một câu trả lời.
 */
export interface Answer {
  answer_id: string;
  is_correct?: boolean;
  choice_text: string;
  choice_image_url?: string;
}

/**
 * Định nghĩa cấu trúc dữ liệu cho một câu hỏi.
 */
export interface Question {
  question_id: string;
  question_type: QuestionType; // Đã thay đổi
  question_text: string;
  question_url?: string;
  answer_choices?: Answer[];
  difficulty_level?: Difficulty; // Đã thay đổi
  topic_name?: string;
  chapter_name?: string;
  id?: number;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint: string;
  difficulty: string; // Tên cũ trong mock data
  topic: string; // Tên cũ trong mock data
}

/**
 * Định nghĩa kiểu dữ liệu cho một câu hỏi trong chế độ học tập.
 */
export interface StudyQuestion extends Question {
  correctAnswer: number;
  explanation: string;
  hint: string;
  difficulty: string;
  topic: string;
  hasImage?: boolean;
}

/**
 * Định nghĩa cấu trúc lưu trữ câu trả lời của người dùng.
 */
export interface SavedExerciseData {
  userAnswers: UserAnswers;
  timeLeft: number;
  exerciseStatus: ExerciseStatus;
  exerciseStartTime: number | null;
  currentQuestionIndex: number;
  lastSaved: number;
}

export interface StudyModeCardProps {
  question: StudyQuestion;
  index: number;
  showAnswer: boolean;
  onToggleAnswer: () => void;
  userAnswer?: number;
  onAnswerSelect: (answerIndex: number) => void;
}

export interface QuestionNavigatorProps {
  questions: StudyQuestion[];
  currentIndex: number;
  onQuestionSelect: (index: number) => void;
  answeredQuestions: Set<number>;
  onToggleView: () => void;
  showAllQuestions: boolean;
}

export interface StudyStatsProps {
  questions: StudyQuestion[];
  answeredQuestions: Set<number>;
  showAnswers: Set<string>;
}

export interface AllQuestionsViewProps {
  questions: StudyQuestion[];
  userAnswers: UserAnswers;
  onAnswerSelect: (questionId: string, answerIndex: number) => void;
  onToggleAnswer: (questionId: string) => void;
  showAnswers: Set<string>;
}

export type { UserAnswers, UserAnswer };