// src/types/common.type.ts

/**
 * Defines the difficulty levels for questions and exercises.
 */
export type Difficulty = 'nhan_biet' | 'thong_hieu' | 'van_dung' | 'van_dung_cao';

/**
 * Defines the type of question (e.g., multiple choice, essay).
 */
export type QuestionType = 'trac_nghiem' | 'dung_sai' | 'dien_dap_an' | 'tu_luan';

/**
 * Represents a user's answer, which can be a string, number, or array.
 */
export type UserAnswer = string | string[] | boolean | number | undefined | null;

/**
 * A dictionary mapping question IDs to a user's answer.
 */
export interface UserAnswers {
  [questionId: string]: UserAnswer;
}