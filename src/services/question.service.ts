// src/services/question.service.ts
import axios from '@/utils/axios.customize';
import { AxiosError } from 'axios';

export interface AnswerDetail {
  question_id: number;
  detail_id: number;
  solution_text: string | null;
  explanation: string | null;
  media_url: string | null;
}

const version = '/api';

const questionService = {
  /**
   * Fetches detailed solutions for a single question.
   * @param questionId The ID of the question.
   * @returns A promise that resolves to an array of AnswerDetail.
   * @throws An error if the question ID is missing or the API call fails.
   */
  async getAnswerDetailsByQuestion(questionId: string): Promise<AnswerDetail[]> {
    if (!questionId) {
      throw new Error('ID câu hỏi không tồn tại');
    }

    const url = `${version}/exercises/${questionId}/answer-detail`;
    try {
      const response = await axios.get(url, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      // Axios automatically parses the JSON, so we just access the data property
      return response.data.metadata as AnswerDetail[];
    } catch (err) {
      console.error('Lỗi khi tải chi tiết câu hỏi:', err);
      // Use axios's built-in error handling to check for specific response errors
    if (err instanceof AxiosError && err.response) {
        throw new Error(`Không thể tải chi tiết câu hỏi: ${err.response.statusText}`);
      }
      throw new Error('Lỗi kết nối hoặc xử lý dữ liệu từ server');
    }
  },
};

export default questionService;