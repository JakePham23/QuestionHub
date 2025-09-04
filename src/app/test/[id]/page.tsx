// src/app/test/[id]/page.tsx
// Đây là Server Component, không cần 'use client'
import React from 'react';
import { Typography, Alert } from 'antd';
import { notFound } from 'next/navigation';
import QuestionListAndCards from '../components/QuestionListAndCards'; 
import { Question } from '@/types/exam.type';
type Params = Promise<{ id: string }>
import { getExerciseData } from '../../../services/exercise.service'; // Import the service

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