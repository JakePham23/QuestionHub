import { api_backend } from '../utils/api';


export interface AnswerDetail {
  question_id: number;
  detail_id: number;
  solution_text: string | null;
  explanation: string | null;
  media_url: string | null;
}


export async function getAnswerDetailsByQuestion(
  questionId: string
): Promise<AnswerDetail[]> {
  if (!questionId) {
    throw new Error('ID câu hỏi không tồn tại');
  }

  try {
    const response = await fetch(
      `${api_backend}/exercises/${questionId}/answer-detail`,
      {
        headers: { 'ngrok-skip-browser-warning': 'true' },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(
        `Không thể tải chi tiết câu hỏi: ${response.statusText}`
      );
    }

    const result = await response.json();
    return result.metadata as AnswerDetail[];
  } catch (err) {
    console.error('Lỗi khi tải chi tiết câu hỏi:', err);
    throw new Error('Lỗi kết nối hoặc xử lý dữ liệu từ server');
  }
}
