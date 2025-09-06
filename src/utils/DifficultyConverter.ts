// src/utils/difficultyConverter.ts
import { Difficulty } from '@/types/common.type'; // Corrected import path

/**
 * Converts a machine-readable difficulty level to a user-friendly Vietnamese string.
 *
 * @param difficulty The difficulty level to convert (e.g., 'nhan_biet').
 * @returns The Vietnamese display name (e.g., 'Nhận biết').
 */
export const getDifficultyDisplayName = (difficulty?: Difficulty): string => {
  switch (difficulty) {
    case 'nhan_biet':
      return 'Nhận biết';
    case 'thong_hieu':
      return 'Thông hiểu';
    case 'van_dung':
      return 'Vận dụng';
    case 'van_dung_cao':
      return 'Vận dụng cao';
    default:
      return 'Khác';
  }
};
