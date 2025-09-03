// src/services/exam.service.ts
import { ExamDetail, Question, SavedExamData } from '../types/exam.type';
import { api_backend } from '../utils/api';

// This function centralizes the data fetching logic
export async function getExamData(examId: string): Promise<{ questions: Question[]; examDetail: ExamDetail }> {
  if (!examId) {
    throw new Error('ID đề thi không tồn tại');
  }

  try {
    const [res1, res2] = await Promise.all([
      fetch(`${api_backend}/exams/${examId}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
        cache: 'no-store',
      }),
      fetch(`${api_backend}/exams/${examId}/questions`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
        cache: 'no-store',
      }),
    ]);

    if (!res1.ok || !res2.ok) {
      throw new Error('Không thể tải đề thi từ server');
    }

    const result1 = await res1.json();
    const result2 = await res2.json();

    // Giả định examDetail nằm trong metadata của response 1
    const examDetail: ExamDetail = result1.metadata;

    // Giả định questions nằm trong metadata của response 2
    const questions: Question[] = result2.metadata;
    
    if (!examDetail || !questions) {
      throw new Error("Cấu trúc dữ liệu đề thi không hợp lệ.");
    }
    
    return { questions, examDetail };

  } catch (err) {
    console.error('Lỗi khi tải dữ liệu đề thi:', err);
    throw new Error('Lỗi kết nối hoặc tải dữ liệu');
  }
}