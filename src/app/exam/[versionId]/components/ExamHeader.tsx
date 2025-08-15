// src/app/exam/[versionId]/components/ExamHeader.tsx
'use client'
import { Layout, Button, Typography, Space, Row, Col } from 'antd';
import { 
  ClockCircleOutlined, 
  SaveOutlined, 
  CheckCircleOutlined,
  QuestionCircleOutlined,
  TrophyOutlined,
  BarsOutlined 
} from '@ant-design/icons';
import React from 'react';

const { Header } = Layout;
const { Title, Text } = Typography;

// Định nghĩa các kiểu dữ liệu
type ExamStatus = 'not-started' | 'in-progress' | 'submitted' | 'time-up';

interface ExamHeaderProps {
  versionId: string;
  timeLeft: number;
  onSubmit: () => void;
  examStatus: ExamStatus;
  totalQuestions?: number;
  answeredCount?: number;
  onShowNavigation?: () => void; // Prop mới
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const ExamHeader: React.FC<ExamHeaderProps> = ({ 
  versionId, 
  timeLeft, 
  onSubmit, 
  examStatus,
  totalQuestions = 0,
  answeredCount = 0,
  onShowNavigation
}) => {
  const isFinished = examStatus === 'submitted' || examStatus === 'time-up';
  const isTimeWarning = timeLeft <= 300 && !isFinished;
  const isTimeCritical = timeLeft <= 60 && !isFinished;

  const getTimeColor = () => {
    if (isFinished) return '#52c41a';
    if (isTimeCritical) return '#ff4d4f';
    if (isTimeWarning) return '#fa8c16';
    return '#1890ff';
  };

  return (
    <Header
      style={{
        background: '#fff',
        padding: '0 24px',
        borderBottom: '2px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: '80px',
        lineHeight: 'normal',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Row style={{ width: '100%' }} justify="space-between" align="middle">
        <Col flex="auto">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Nút hamburger chỉ hiển thị khi có onShowNavigation (tức là ở mobile) */}
            {onShowNavigation && (
              <Button
                type="text"
                icon={<BarsOutlined />}
                onClick={onShowNavigation}
                style={{ fontSize: '24px', color: '#1890ff' }}
              />
            )}
            <div>
              <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                🎯 Đề thi mã số {versionId}
              </Title>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                <Space size="middle">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '14px' }} />
                    <Text style={{ fontSize: '14px', color: '#52c41a', fontWeight: 'bold' }}>
                      {answeredCount}
                    </Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <QuestionCircleOutlined style={{ color: '#d9d9d9', fontSize: '14px' }} />
                    <Text style={{ fontSize: '14px', color: '#8c8c8c', fontWeight: 'bold' }}>
                      {totalQuestions - answeredCount}
                    </Text>
                  </div>
                </Space>
              </div>
            </div>
          </div>
        </Col>

        <Col>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              padding: '8px 16px',
              background: isFinished ? '#f6ffed' : 
                         isTimeCritical ? '#fff2f0' : 
                         isTimeWarning ? '#fff7e6' : '#e6f7ff',
              borderRadius: '8px',
              border: `2px solid ${getTimeColor()}`,
              minWidth: '120px'
            }}>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: getTimeColor(),
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                {isFinished ? <TrophyOutlined /> : <ClockCircleOutlined />}
                {isFinished ? 'Hoàn thành' : formatTime(timeLeft)}
              </div>
              <Text 
                style={{ 
                  fontSize: '11px', 
                  color: getTimeColor(),
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}
              >
                {isFinished ? 'Đã nộp bài' : 
                 isTimeCritical ? 'Nguy hiểm!' : 
                 isTimeWarning ? 'Cảnh báo!' : 'Thời gian'}
              </Text>
            </div>

            <Button
              type="primary"
              size="large"
              icon={<SaveOutlined />}
              onClick={onSubmit}
              disabled={isFinished}
              style={{
                height: '50px',
                fontSize: '16px',
                fontWeight: 'bold',
                minWidth: '120px',
                background: isFinished ? '#52c41a' : undefined,
                borderColor: isFinished ? '#52c41a' : undefined
              }}
            >
              {isFinished ? '✅ Đã nộp' : '📤 Nộp bài'}
            </Button>
          </div>
        </Col>
      </Row>
    </Header>
  );
};

export default ExamHeader;