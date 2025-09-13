import { StudyQuestion } from '@/types/exercise.type';
import { api_backend } from '../utils/api';
import { TopicExerciseInfo,  AnswerCorrect, ExerciseTopicStatusInfo} from '@/types/exercise.type';

interface ExerciseTopicsResponse {
  metadata: TopicExerciseInfo[];
}
interface ExerciseTopicStatusResponse {
  metadata: ExerciseTopicStatusInfo[];
}

interface AnswerDetail {
  question_id: number;
  detail_id: number;
  solution_text: string | null;
  explanation: string | null;
  media_url: string | null;
}

// ✅ Lấy danh sách chuyên đề
export async function getExerciseTopics(): Promise<ExerciseTopicsResponse> {
  const response = await fetch(`${api_backend}/exercises/exercise-topics`, {
    headers: { 'ngrok-skip-browser-warning': 'true' },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch exercise topics: ${response.statusText}`);
  }

  const result = await response.json();
  return { metadata: result.metadata };
}
export async function getExerciseTopicStatus(): Promise<ExerciseTopicStatusResponse> {
  // 1️⃣ Lấy user từ localStorage
  const userJson = localStorage.getItem('user');
  if (!userJson) throw new Error('User not found in localStorage');
  
  const user = JSON.parse(userJson);
  const userId = user?.id;
  if (!userId) throw new Error('Invalid user data in localStorage');

  // 2️⃣ Gửi user_id lên backend
  const response = await fetch(
    `${api_backend}/exercises/exercise-topic-status?user_id=${userId}`,
    {
      headers: { 'ngrok-skip-browser-warning': 'true' },
      cache: 'no-store',
    }
  );

  // 3️⃣ Xử lý phản hồi
  if (!response.ok) {
    throw new Error(`Failed to fetch exercise topics: ${response.statusText}`);
  }

  const result = await response.json();
  return { metadata: result.metadata };
}

// ✅ Lấy câu hỏi theo topic
export async function getExerciseData(
  topicId: number
): Promise<{ questions: StudyQuestion[] }> {
  if (!topicId) throw new Error('ID chuyên đề không tồn tại');

  const response = await fetch(`${api_backend}/exercises/${topicId}/questions`, {
    headers: { 'ngrok-skip-browser-warning': 'true' },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Không thể tải dữ liệu: ${response.statusText}`);
  }

  const result = await response.json();
  return { questions: result.metadata as StudyQuestion[] };
}

// ✅ Lấy đáp án đúng theo topic
export async function getAnswerCorrectByTopic(
  topicId: number
): Promise<{answerCorrects: AnswerCorrect[]}> {
  const response = await fetch(`${api_backend}/exercises/${topicId}/answer-correct`, {
    headers: { 'ngrok-skip-browser-warning': 'true' },
    cache: 'no-store',
  });
  // if (!response.ok) {
  //   throw new Error(`Không thể tải đáp án đúng: ${response.statusText}`);
  // }

  const result = await response.json();
  return {answerCorrects: result.metadata as AnswerCorrect[]};
}
// ✅ Lấy lời giải chi tiết theo topic
export async function getAnswerDetailsByTopic(
  topicId: string
): Promise<AnswerDetail[]> {
  const response = await fetch(`${api_backend}/exercises/${topicId}/answer-detail`, {
    headers: { 'ngrok-skip-browser-warning': 'true' },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Không thể tải lời giải chi tiết: ${response.statusText}`);
  }

  const result = await response.json();
  return result.metadata as AnswerDetail[];
}
export async function saveQuestionAttempt(attempt: {
  user_id: number;
  question_id: number;
  selected_answer_id: number | null;
  user_answer_text: string | null;
  is_correct: boolean;
}) {
  console.log(attempt);
  const res = await fetch(`${api_backend}/exercises/attempt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    },
    body: JSON.stringify(attempt)
  });

  if (!res.ok) throw new Error('Lưu attempt thất bại');
  return res.json();
}


export async function getQuestionAttempts(topicId: number, userId: number) {
  const res = await fetch(
    `${api_backend}/exercises/${topicId}/question-attempts?user_id=${userId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      }
    }
  );

  if (!res.ok) throw new Error('Lấy attempts thất bại');
  return res.json();
}