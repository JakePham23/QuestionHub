// src/app/test/components/QuestionListAndCards.tsx
'use client';
import React from 'react';
import { Card, Typography } from 'antd';
import QuestionCard from '../../exam/components/QuestionCard'; // Import QuestionCard
import { Question } from '@/types/exam.type';

const { Title, Paragraph, Text } = Typography;

interface QuestionListAndCardsProps {
  questions: Question[];
  versionId: string;
}

const QuestionListAndCards: React.FC<QuestionListAndCardsProps> = ({ questions, versionId }) => {
  return (
    <div style={{ padding: '20px' }}>
      <Title>Kiểm tra Render Câu hỏi từ Backend</Title>
      <Paragraph type="secondary">
        Dữ liệu dưới đây được fetch trực tiếp từ API backend cho bài thi ID **`{versionId}`**.
      </Paragraph>
      <Paragraph type="secondary">
        Đã tìm thấy **{questions.length}** câu hỏi.
      </Paragraph>

      {questions.map((question, index) => (
        // Sử dụng component QuestionCard để render từng câu hỏi
        <QuestionCard
          key={question.question_id}
          question={question}
          index={index}
          isCurrent={false} // Giá trị giả định cho mục đích test
          userAnswer={undefined} // Giá trị giả định cho mục đích test
          onAnswerChange={() => {}} // Hàm rỗng cho mục đích test
          examStatus="in-progress" // Giá trị giả định cho mục đích test
        />
      ))}
    </div>
  );
};

export default QuestionListAndCards;