// src/services/exam.service.ts
import axios from '@/utils/axios.customize';
import { AxiosError } from 'axios';
import { ExamDetail, Question } from '../types/exam.type';

const version = '/api';

const examService = {
  /**
   * Fetches an exam's details and its questions concurrently.
   * @param examId The ID of the exam to fetch.
   * @returns A promise that resolves to an object containing the questions and exam details.
   * @throws An error if the API call fails or the data is malformed.
   */
  async getExamData(examId: string): Promise<{ questions: Question[]; examDetail: ExamDetail }> {
    if (!examId) {
      throw new Error('ID đề thi không tồn tại');
    }

    try {
      const [examDetailRes, questionsRes] = await Promise.all([
        axios.get(`${version}/exams/${examId}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        }),
        axios.get(`${version}/exams/${examId}/questions`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        }),
      ]);

      const examDetail: ExamDetail = examDetailRes.data.metadata;
      const questions: Question[] = questionsRes.data.metadata;

      if (!examDetail || !questions) {
        throw new Error('Cấu trúc dữ liệu đề thi không hợp lệ.');
      }

      return { questions, examDetail };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err : any) {
      console.error('Lỗi khi tải dữ liệu đề thi:', err);
      // ✅ Correct usage: Check if the error is an AxiosError using `instanceof`
      if (err instanceof AxiosError && err.response) {
        throw new Error(`Lỗi từ server: ${err.response.status} - ${err.response.statusText}`);
      }
      throw new Error('Lỗi kết nối hoặc tải dữ liệu');
    }
  },
};

export default examService;