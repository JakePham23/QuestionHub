import { Difficulty, QuestionType, UserAnswers } from './common.type';

/**
 * Trạng thái của một bài tập.
 */
export type ExerciseStatus = 'not_started' | 'in_progress' | 'completed' | 'all';

export interface Exercise {
  id: number;
  title: string;
  description: string;
  subject: string;
  grade: string;
  chapter: string | null;
  topic?: string;
  totalQuestions: number;
  status: ExerciseStatus;
}

export interface TopicExerciseInfo {
  topic_id: number;
  topic_name: string;
  topic_description: string;
  subject_name: string;
  grade_name: string;
  chapter_id: number | null;      // vì có thể null nếu chưa có câu hỏi
  chapter_name: string | null;    // cũng có thể null
  total_questions: number;
  exercise_status?: ExerciseStatus;  
}

/**
 * Lựa chọn đáp án trong trắc nghiệm.
 */
export interface Answer {
  answer_id: string;
  choice_text: string;
  choice_image_url?: string;
  is_correct?: boolean; // backend có thể trả hoặc không
}

/**
 * Câu hỏi cơ bản.
 */
export interface Question {
  question_id: string;
  question_type: QuestionType;
  question_text: string;
  question_url?: string;

  answer_choices?: Answer[]; // dùng cho trắc nghiệm
  difficulty_level?: Difficulty;
  topic_name?: string;
  chapter_name?: string;

  // Cho tự luận
  explanation?: string;
  hint?: string;
}

/**
 * Câu hỏi khi vào chế độ học tập.
 * Có thêm đáp án đúng & hint (sau khi fetch từ API).
 */
export interface StudyQuestion extends Question {
  correctAnswerId?: string;      // dùng cho trắc nghiệm
  correctAnswerText?: string;    // dùng cho tự luận
  explanation?: string;
  hint?: string;
}

/**
 * Thông tin khi lưu tiến độ luyện tập.
 */
export interface SavedExerciseData {
  userAnswers: UserAnswers;
  timeLeft: number;
  exerciseStatus: ExerciseStatus;
  exerciseStartTime: number | null;
  currentQuestionIndex: number;
  lastSaved: number;
}

/**
 * Props cho StudyModeCard
 */
export interface StudyModeCardProps {
  question: StudyQuestion;
  index: number;
  showAnswer: boolean;
  onToggleAnswer: () => void;
  userAnswer?: string | number; // string (tự luận), number (trắc nghiệm)
  onAnswerSelect: (answer: string | number) => void;
  answer_corrects: AnswerCorrect[];
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
  onAnswerSelect: (questionId: string, answer: string | number) => void;
  onToggleAnswer: (questionId: string) => void;
  showAnswers: Set<string>;
  showAnswerCorrect: boolean;
}

/**
 * Đáp án đúng / lời giải trả về từ API
 */
export interface AnswerCorrect {
  question_id: number;
  answer_correct: string;
}

export interface ExerciseTopicStatusInfo{
  topic_id: number;
  exercise_status: ExerciseStatus;
}

export interface QuestionAttempt {
  question_id: number;
  selected_answer_id: number | null;
  user_answer_text: string | null;
  is_correct: boolean;
}
