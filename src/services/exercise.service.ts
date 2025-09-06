// src/services/exercise.service.ts
import { Question } from '@/types/exam.type';
import { api_backend } from '../utils/api';
import { TopicExerciseInfo } from '@/types/exercise.type';

/**
 * Kiểu dữ liệu phản hồi từ API khi lấy danh sách chuyên đề.
 */
interface ExerciseTopicsResponse {
  metadata: TopicExerciseInfo[];
}

/**
 * Lấy danh sách chuyên đề (exercise topics) từ backend.
 * @returns Một object chứa metadata: danh sách chuyên đề.
 */
export async function getExerciseTopics(): Promise<ExerciseTopicsResponse> {
  try {
    const response = await fetch(`${api_backend}/exercises/exercise-topics`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch exercise topics: ${response.statusText}`);
    }

    const result = await response.json();

    return { metadata: result.metadata };
  } catch (error) {
    console.error('Error fetching exercise topics:', error);
    throw new Error('Lỗi kết nối hoặc tải dữ liệu chuyên đề.');
  }
}

/**
 * Lấy dữ liệu bài tập và các câu hỏi liên quan từ backend.
 * @param topicId ID của chuyên đề cần lấy dữ liệu.
 * @returns Một object chứa danh sách câu hỏi.
 */
export async function getExerciseData(
  topicId: string
): Promise<{ questions: Question[] }> {
  if (!topicId) {
    throw new Error('ID chuyên đề không tồn tại');
  }

  try {
    const response = await fetch(
      `${api_backend}/exercises/${topicId}/questions`,
      {
        headers: { 'ngrok-skip-browser-warning': 'true' },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`Không thể tải dữ liệu từ server: ${response.statusText}`);
    }

    const result = await response.json();

    // Giả sử backend trả về { metadata: [...] }
    const questions: Question[] = result.metadata;

    if (!questions) {
      throw new Error(
        'Cấu trúc dữ liệu trả về không hợp lệ. Không tìm thấy danh sách câu hỏi.'
      );
    }

    return { questions };
  } catch (err) {
    console.error('Lỗi khi tải dữ liệu bài tập:', err);
    throw new Error('Lỗi kết nối hoặc xử lý dữ liệu từ server');
  }
}
