// src/services/exam.service.ts
import { Question } from '@/types/exam.type';
import { api_backend } from '../utils/api';

/**
 * Lấy dữ liệu bài tập và các câu hỏi liên quan từ backend.
 * @param topicId ID của chuyên đề cần lấy dữ liệu.
 * @returns Một đối tượng chứa danh sách câu hỏi.
 */
export async function getExerciseData(topicId: string): Promise<{ questions: Question[] }> {
  if (!topicId) {
    throw new Error('ID chuyên đề không tồn tại');
  }

  try {
    const response = await fetch(`${api_backend}/exercise/${topicId}/questions`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Không thể tải dữ liệu từ server: ${response.statusText}`);
    }

    const result = await response.json();

    // Sửa lỗi: Lấy questions từ trường 'data.questions' của response
    const questions: Question[] = result.metadata;
    
    if (!questions) {
      throw new Error("Cấu trúc dữ liệu trả về không hợp lệ. Không tìm thấy danh sách câu hỏi.");
    }

    // Sửa lỗi: Trả về một object chứa questions, phù hợp với kiểu dữ liệu của Promise
    return { questions };

  } catch (err) {
    console.error('Lỗi khi tải dữ liệu bài tập:', err);
    throw new Error('Lỗi kết nối hoặc xử lý dữ liệu từ server');
  }
}