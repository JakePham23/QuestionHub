// src/app/test/[id]/page.tsx
'use client';
// Đây là Server Component, không cần 'use client'
import React from 'react';
import { Typography, Alert } from 'antd';
import { getMediaUrl } from '../../../utils/media';
import { notFound } from 'next/navigation';
import QuestionListAndCards from '../components/QuestionListAndCards'; 
import QuestionImage from '../components/QuestionImage'; // Import component mới
import { Question } from '@/types/exam.type';
type Params = Promise<{ id: string }>

const { Title, Paragraph } = Typography;

export default async function page({ params }: { params: Params }) {
  const { id } = await params;

  if (!id) {
    notFound(); 
  }

  try {
    const response = await fetch(`http://localhost:3001/api/exams/${id}/questions`, {
      cache: 'no-store' 
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.metadata || data.metadata.length === 0) {
      return (
        <Alert
          message="Không có dữ liệu"
          description={`Không tìm thấy câu hỏi nào cho bài thi ID: ${id}. Vui lòng kiểm tra lại endpoint API hoặc cấu trúc dữ liệu trả về.`}
          type="warning"
          showIcon
          style={{ margin: '20px' }}
        />
      );
    }

    const questions = data.metadata;

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