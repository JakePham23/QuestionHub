// src/types/exercise.type.ts

// Định nghĩa các type và interface liên quan đến bài tập

/**
 * Định nghĩa các mức độ khó của bài tập.
 */
export type Difficulty = 'nhan_biet' | 'thong_hieu' | 'van_dung' | 'van_dung_cao';

/**
 * Định nghĩa các trạng thái của một bài tập.
 */
export type ExerciseStatus = 'not_started' | 'in_progress' | 'completed' | 'all';

/**
 * Định nghĩa cấu trúc dữ liệu cơ bản cho một bài tập.
 * Dữ liệu này có thể được gán giả định hoặc lấy từ một API khác.
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
    difficulty: Difficulty;
    totalQuestions: number;
    timeLimit: number;
    status: ExerciseStatus;
    score: number;
    completedAt?: string;
    attempts: number;
    
}

/**
 * Định nghĩa cấu trúc dữ liệu cho một chủ đề bài tập.
 * Dữ liệu này được lấy từ hàm SQL `get_topic_exercise_info()`.
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

