// src/services/exercise.service.ts
import axios from '@/utils/axios.customize';
import { StudyQuestion, TopicExerciseInfo, AnswerCorrect, ExerciseTopicStatusInfo } from '@/types/exercise.type';
import { AxiosError } from 'axios';

const version = '/api';
export interface AnswerDetail {
  question_id: number;
  detail_id: number;
  solution_text: string | null;
  explanation: string | null;
  media_url: string | null;
}

const exerciseService = {
  /**
   * Fetches the list of exercise topics.
   * @returns A promise that resolves to an object with metadata containing an array of TopicExerciseInfo.
   * @throws An error if the API call fails.
   */
  async getExerciseTopics(): Promise<{ metadata: TopicExerciseInfo[] }> {
    const url = `${version}/exercises/exercise-topics`;
    try {
      const response = await axios.get(url, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      return { metadata: response.data.metadata };
    } catch (err) {
      console.error('Lỗi khi tải danh sách chuyên đề:', err);
      throw new Error(`Không thể tải chuyên đề bài tập.`);
    }
  },

  /**
   * Fetches the status of exercise topics for a specific user.
   * @returns A promise that resolves to an object with metadata containing an array of ExerciseTopicStatusInfo.
   * @throws An error if user data is missing.
   */
  async getExerciseTopicStatus(): Promise<{ metadata: ExerciseTopicStatusInfo[] }> {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      // Return empty metadata without throwing an error if no user is found
      return { metadata: [] };
    }

    const user = JSON.parse(userJson);
    const userId = user?.id;
    if (!userId) {
      return { metadata: [] };
    }

    const url = `${version}/exercises/exercise-topic-status`;
    try {
      const response = await axios.get(url, {
        params: { user_id: userId },
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      return { metadata: response.data.metadata };
    } catch (err) {
      console.error('Lỗi khi tải trạng thái chuyên đề:', err);
      throw new Error(`Không thể tải trạng thái chuyên đề.`);
    }
  },

  /**
   * Fetches questions for a given topic ID.
   * @param topicId The ID of the topic.
   * @returns A promise that resolves to an object containing an array of StudyQuestion.
   * @throws An error if the topic ID is missing or the API call fails.
   */
  async getExerciseData(topicId: number): Promise<{ questions: StudyQuestion[] }> {
    if (!topicId) {
      throw new Error('ID chuyên đề không tồn tại');
    }

    const url = `${version}/exercises/${topicId}/questions`;
    try {
      const response = await axios.get(url, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      return { questions: response.data.metadata };
    } catch (err) {
      console.error('Lỗi khi tải câu hỏi:', err);
      throw new Error(`Không thể tải dữ liệu câu hỏi.`);
    }
  },

  /**
   * Fetches the correct answers for a given topic.
   * @param topicId The ID of the topic.
   * @returns A promise that resolves to an object containing an array of AnswerCorrect.
   * @throws An error if the API call fails.
   */
  async getAnswerCorrectByTopic(topicId: number): Promise<{ answerCorrects: AnswerCorrect[] }> {
    const url = `${version}/exercises/${topicId}/answer-correct`;
    try {
      const response = await axios.get(url, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      return { answerCorrects: response.data.metadata };
    } catch (err) {
      console.error('Lỗi khi tải đáp án đúng:', err);
      throw new Error(`Không thể tải đáp án đúng.`);
    }
  },

  /**
   * Fetches detailed solutions for a given topic.
   * @param topicId The ID of the topic.
   * @returns A promise that resolves to an array of AnswerDetail.
   * @throws An error if the API call fails.
   */
  async getAnswerDetailsByTopic(topicId: string): Promise<AnswerDetail[]> {
    const url = `${version}/exercises/${topicId}/answer-detail`;
    try {
      const response = await axios.get(url, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      return response.data.metadata;
    } catch (err) {
      console.error('Lỗi khi tải lời giải chi tiết:', err);
      throw new Error(`Không thể tải lời giải chi tiết.`);
    }
  },

  /**
   * Saves a user's attempt at a question.
   * @param attempt The attempt data to save.
   * @returns A promise that resolves to the saved data from the server.
   * @throws An error if the API call fails.
   */
  async saveQuestionAttempt(attempt: {
    user_id: number;
    question_id: number;
    selected_answer_id: number | null;
    user_answer_text: string | null;
    is_correct: boolean;
  }) {
    const url = `${version}/exercises/attempt`;
    try {
      const response = await axios.post(url, attempt, {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
      });
      return response.data;
    } catch (err) {
      console.error('Lỗi khi lưu attempt:', err);
      throw new Error('Lưu attempt thất bại');
    }
  },

  /**
   * Fetches a user's previous attempts for questions in a specific topic.
   * @param topicId The ID of the topic.
   * @param userId The ID of the user.
   * @returns A promise that resolves to the attempt data from the server.
   * @throws An error if the API call fails.
   */
  async getQuestionAttempts(topicId: number, userId: number) {
    const url = `${version}/exercises/${topicId}/question-attempts`;
    try {
      const response = await axios.get(url, {
        params: { user_id: userId },
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
      });
      return response.data;
    } catch (err) {
      console.error('Lỗi khi lấy attempts:', err);
      throw new Error('Lấy attempts thất bại');
    }
  },

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
      return response.data.metadata;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err : any) {
      console.error('Lỗi khi tải chi tiết câu hỏi:', err);
      if (err instanceof AxiosError && err.response) {
        throw new Error(`Không thể tải chi tiết câu hỏi.`);
      }
      throw new Error('Lỗi kết nối hoặc xử lý dữ liệu từ server');
    }
  },
};

export default exerciseService;