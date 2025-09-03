// src/app/test/components/QuestionImage.tsx
'use client';
import React from 'react';
import { Typography } from 'antd';
import { getMediaUrl } from '../../../utils/media';

const { Text } = Typography;

interface QuestionImageProps {
  imageUrl?: string | null;
}

const QuestionImage: React.FC<QuestionImageProps> = ({ imageUrl }) => {
  if (!imageUrl) {
    return null; // Không hiển thị gì nếu không có URL hình ảnh
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
      <Text type="secondary" style={{ display: 'block', marginBottom: '10px' }}>
        Hình ảnh minh họa
      </Text>
      <img
        src={getMediaUrl(imageUrl)}
        alt="Hình ảnh câu hỏi"
        style={{
          maxWidth: '100%',
          height: 'auto',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      />
    </div>
  );
};

export default QuestionImage;