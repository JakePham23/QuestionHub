// src/app/test/[id]/page.tsx
'use client';
// Đây là Server Component, không cần 'use client'
import React from 'react';
import { Typography, Alert } from 'antd';
import { notFound } from 'next/navigation';
import QuestionListAndCards from '../components/QuestionListAndCards'; 
import QuestionImage from '../components/QuestionImage'; // Import component mới
import { Question } from '@/types/exam.type';
type Params = Promise<{ id: string }>
import { getExerciseData } from '../../../services/exercise.service'; // Import the service

const { Title, Paragraph } = Typography;

export default async function page({ params }: { params: Params }) {
  const { id } = await params;

  if (!id) {
    notFound(); 
  }

  let questions: Question[] = [];

  try {
    const data = await getExerciseData(id); // Use the service function
    questions = data.questions;

    return (
      <div style={{ padding: '20px' }}>
        <Title level={2}>Kiểm tra Render Câu hỏi từ Backend</Title>
        <Paragraph type="secondary">
          Dữ liệu dưới đây được fetch trực tiếp từ API backend cho bài thi ID **`{id}`**.
        </Paragraph>

        {/* Khu vực render hình ảnh */}
        <QuestionImage />
        
        <QuestionListAndCards
          questions={questions}
          versionId={id}
        />
      </div>
    );
  } catch (err) {
    return (
      <Alert
        message="Lỗi"
        description={`Không thể tải dữ liệu: ${(err as Error).message}. Vui lòng kiểm tra lại backend và đường dẫn API.`}
        type="error"
        showIcon
        style={{ margin: '20px' }}
      />
    );
  }
}