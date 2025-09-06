// src/utils/questionTypeConverter.ts
import { QuestionType } from '@/types/common.type'; // Corrected import path

/**
 * Converts a machine-readable question type to a user-friendly Vietnamese string.
 *
 * @param type The question type to convert (e.g., 'trac_nghiem').
 * @returns The Vietnamese display name (e.g., 'Trắc nghiệm').
 */
export const getQuestionTypeDisplayName = (type: QuestionType | undefined): string => {
  switch (type) {
    case 'trac_nghiem':
      return 'Trắc nghiệm';
    case 'tu_luan':
      return 'Tự luận';
    case 'dung_sai':
      return 'Đúng/Sai';
    case 'dien_dap_an':
      return 'Điền đáp án';
    default:
      return 'Khác';
  }
};