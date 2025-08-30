// types/exam.type.ts
// Định nghĩa các kiểu dữ liệu
interface Answer {
  answer_id: string;
  is_correct?: boolean;
  choice_text: string;
  choice_media_url?: string;
}

interface Question {
  question_id: string;
  question_type: string;
  question_text: string;
  answers?: Answer[];
  answer_choices?: Answer[];
  question_url?: string;
}

interface ExamDetail {
  exam_id: string;
  title: string;
  school_year: string;
  description: string;
  total_questions: number;
  duration_minutes: number;
  subject_name: string;
  grade_name: string;
  source_name: string;
}

interface UserAnswers {
  [questionId: string]: string | string[] | number;
}
type UserAnswer = string | string[] | boolean | number | undefined | null;

type ExamStatus = 'not-started' | 'in-progress' | 'submitted' | 'time-up';

interface SavedExamData {
  userAnswers: UserAnswers;
  timeLeft: number;
  examStatus: ExamStatus;
  examStartTime: number | null;
  currentQuestionIndex: number;
  lastSaved: number;
}

export type {
  Answer,
  Question,
  ExamDetail,
  UserAnswers,
  UserAnswer,
  ExamStatus,
  SavedExamData
}