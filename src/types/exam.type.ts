// types/exam.type.ts

// Định nghĩa các kiểu dữ liệu cơ bản
interface Answer {
  answer_id: string;
  is_correct?: boolean;
  choice_text: string;
  choice_media_url?: string;
}

interface Question {
  question_id: string;
  question_type: 'trac_nghiem' | 'dung_sai' | 'dien_dap_an' | 'tu_luan';
  question_text: string;
  question_url?: string;
  answer_choices?: Answer[];
  difficulty_level?: 'nhan_biet' | 'thong_hieu' | 'van_dung' | 'van_dung_cao';
  topic_name?: string;
  chapter_name?: string;
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

type UserAnswer = string | string[] | boolean | number | undefined | null;

interface UserAnswers {
  [questionId: string]: UserAnswer;
}

type ExamStatus = 'not-started' | 'in-progress' | 'submitted' | 'time-up';

interface SavedExamData {
  userAnswers: UserAnswers;
  timeLeft: number;
  examStatus: ExamStatus;
  examStartTime: number | null;
  currentQuestionIndex: number;
  lastSaved: number;
}

// Định nghĩa kiểu dữ liệu cho kết quả bài thi
type AnswerStatus =
  'default' |
  'correct-selected' |
  'incorrect-selected' |
  'correct-not-selected';

interface QuestionResult {
  question_id: string;
  question_text: string;
  question_type: string;
  user_answer: UserAnswer;
  correct_answer_id?: string;
  is_correct: boolean;
  choices: Answer[];
}

interface ExamResult {
  exam_id: string;
  score: number;
  total_correct: number;
  total_questions: number;
  results_by_question: QuestionResult[];
  submitted_at: number;
}

// Định nghĩa kiểu dữ liệu cho Blog
interface BlogPost {
  post_id: string;
  author_id: string;
  title: string;
  slug: string;
  content: string;
  created_at: number;
  published_at: number;
  author_name: string;
  views: number;
  topics: {
    topic_id: string;
    topic_name: string;
  }[];
}

interface Topic {
  topic_id: string;
  topic_name: string;
  subject_name: string;
  grade_name: string;
}

export type {
  Answer,
  Question,
  ExamDetail,
  UserAnswers,
  UserAnswer,
  ExamStatus,
  SavedExamData,
  AnswerStatus,
  QuestionResult,
  ExamResult,
  BlogPost,
  Topic
};