// src/components/ExerciseHeader.tsx
'use client';
import { Card, Typography, Button, Space, Grid } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import React from 'react';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

interface ExerciseHeaderProps {
  topicName: string;
}

const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({ topicName }) => {
  const screens = useBreakpoint();
  const isMobile = screens.xs || screens.sm;

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        padding: isMobile ? '12px' : '16px 24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <Space size="large">
          <Button type="text" icon={<LeftOutlined />} size="large" onClick={() => window.history.back()} />
          <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
            {topicName}
          </Title>
        </Space>
        {!isMobile && <Text type="secondary">Chế độ luyện tập</Text>}
      </div>
    </div>
  );
};

export default ExerciseHeader;