// src/utils/colorUtils.ts

import {Difficulty } from '@/types/common.type';
import { ExerciseStatus } from '@/types/exercise.type';
export const getDifficultyColor = (difficulty?: Difficulty): string => {
  switch (difficulty) {
    case 'nhan_biet':
      return '#1890ff';
    case 'thong_hieu':
      return '#52c41a';
    case 'van_dung':
      return '#faad14';
    case 'van_dung_cao':
      return '#f5222d';
    default:
      return '#8c8c8c';
  }
};

export const getCardStyle = (status: ExerciseStatus | 'all') => {
  switch (status) {
    case 'not_started':
      return { backgroundColor: '#fff' };
    case 'in_progress':
      return { backgroundColor: '#FEFCE8' }; // Yellow tint
    case 'completed':
      return { backgroundColor: '#EFFDF4' }; // Green tint
    default:
      return { backgroundColor: '#fff' };
  }
};

export const getButtonColor = (status: ExerciseStatus) => {
  switch (status) {
    case 'not_started':
      return { backgroundColor: '#1890ff' };
    case 'in_progress':
      return { backgroundColor: '#CA8A03' }; // Dark yellow
    case 'completed':
      return { backgroundColor: '#16A349' }; // Dark green
    default:
      return { backgroundColor: '#1890ff' };
  }
};

export const getStatusTagColor = (status: ExerciseStatus) => {
  switch (status) {
    case 'not_started':
      return 'blue';
    case 'in_progress':
      return 'orange';
    case 'completed':
      return 'green';
    default:
      return 'gray';
  }
};