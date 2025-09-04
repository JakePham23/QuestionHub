// src/app/test/components/QuestionListAndCards.tsx
'use client';
import React from 'react';
import { Typography } from 'antd';
// Import component QuestionList đã được xây dựng sẵn
import QuestionList from '../../../components/questions/QuestionList';
import { Question, UserAnswers, ExamStatus } from '@/types/exam.type';

const { Title, Paragraph } = Typography;

interface QuestionListAndCardsProps {
  questions: Question[];
  versionId: string;
}

const QuestionListAndCards: React.FC<QuestionListAndCardsProps> = ({ questions, versionId }) => {
  // Chuẩn bị các props giả định để truyền vào QuestionList
  // Trong môi trường thực tế, các giá trị này sẽ được lấy từ state của ứng dụng
  const userAnswers: UserAnswers = {}; // Ví dụ: một đối tượng rỗng
  const onAnswerChange = () => {}; // Một hàm rỗng
  const examStatus: ExamStatus = "in-progress";
  const currentQuestionIndex = 0; // Đang ở câu hỏi đầu tiên
  const isMobile = false; // Giá trị giả định

  return (
    <div style={{ padding: '20px' }}>
      <Title>Kiểm tra Render Câu hỏi từ Backend</Title>
      <Paragraph type="secondary">
        Dữ liệu dưới đây được fetch trực tiếp từ API backend cho bài thi ID **`{versionId}`**.
      </Paragraph>
      <Paragraph type="secondary">
        Đã tìm thấy **{questions.length}** câu hỏi.
      </Paragraph>

      {/* Sử dụng lại component QuestionList để render danh sách câu hỏi */}
      <QuestionList
        questions={questions}
        userAnswers={userAnswers}
        onAnswerChange={onAnswerChange}
        examStatus={examStatus}
        currentQuestionIndex={currentQuestionIndex}
        isMobile={isMobile}
      />
    </div>
  );
};

export default QuestionListAndCards;