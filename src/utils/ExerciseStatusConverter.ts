// src/utils/exerciseStatusConverter.ts
// Bạn cần tạo file này để sử dụng các hàm tiện ích mới
export type ExerciseStatus = 'not_started' | 'in_progress' | 'completed' | 'all';

export const getStatusColor = (status: ExerciseStatus) => {
  switch (status) {
    case 'completed': return 'success';
    case 'in_progress': return 'processing';
    case 'not_started': return 'default';
    default: return 'default';
  }
};

export const getStatusText = (status: ExerciseStatus) => {
  switch (status) {
    case 'completed': return 'Đã hoàn thành';
    case 'in_progress': return 'Đang làm';
    case 'not_started': return 'Chưa bắt đầu';
    default: return status;
  }
};

// src/utils/difficultyConverter.ts
import { Difficulty } from '@/types/common.type';

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

export const getDifficultyColor = (difficulty?: Difficulty) => {
  switch (difficulty) {
    case 'nhan_biet': return 'orange';
    case 'thong_hieu': return 'green';
    case 'van_dung': return 'red';
    case 'van_dung_cao': return 'magenta';
    default: return 'blue';
  }
};