'use client'
import { Layout, Button, Typography, Space, Row, Col, Grid } from 'antd';
import { 
  ClockCircleOutlined, 
  SaveOutlined, 
  CheckCircleOutlined,
  QuestionCircleOutlined,
  TrophyOutlined,
  BarsOutlined 
} from '@ant-design/icons';
import React from 'react';

// Import types từ file trung tâm
import { ExamStatus } from '@/types/exam.type';

const { Header } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

interface ExamHeaderProps {
  title: string;
  timeLeft: number;
  onSubmit: () => void;
  examStatus: ExamStatus;
  totalQuestions?: number;
  answeredCount?: number;
  onShowNavigation?: () => void;
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const ExamHeader: React.FC<ExamHeaderProps> = ({ 
  title, 
  timeLeft, 
  onSubmit, 
  examStatus,
  totalQuestions = 0,
  answeredCount = 0,
  onShowNavigation
}) => {
  const screens = useBreakpoint();
  const isMobile = screens.xs || screens.sm;
  const isVerySmall = screens.xs;
  
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
        padding: isMobile ? '0 12px' : '0 24px',
        borderBottom: '2px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: isMobile ? '60px' : '80px',
        lineHeight: 'normal',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {isMobile ? (
        <div style={{ 
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            flex: 1,
            minWidth: 0
          }}>
            {onShowNavigation && (
              <Button
                type="text"
                icon={<BarsOutlined />}
                onClick={onShowNavigation}
                style={{ 
                  fontSize: '16px', 
                  color: '#1890ff',
                  minWidth: 'auto',
                  padding: '0 2px',
                  width: '28px',
                  height: '28px'
                }}
              />
            )}
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <Title level={5} style={{ 
                margin: 0, 
                color: '#1890ff',
                fontSize: isVerySmall ? '13px' : '14px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: '1.2'
              }}>
                🎯 {title}
              </Title>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '4px',
                marginTop: '2px'
              }}>
                <Space size="small">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '10px' }} />
                    <Text style={{ fontSize: '10px', color: '#52c41a', fontWeight: 'bold' }}>
                      {answeredCount}
                    </Text>
                  </div>
                  <Text style={{ fontSize: '10px', color: '#8c8c8c' }}>
                    /{totalQuestions}
                  </Text>
                </Space>
              </div>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            flexShrink: 0
          }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              padding: '3px 6px',
              background: isFinished ? '#f6ffed' : 
                         isTimeCritical ? '#fff2f0' : 
                         isTimeWarning ? '#fff7e6' : '#e6f7ff',
              borderRadius: '4px',
              border: `1px solid ${getTimeColor()}`,
              minWidth: '50px'
            }}>
              <div style={{ 
                fontSize: '11px', 
                fontWeight: 'bold', 
                color: getTimeColor(),
                lineHeight: '1'
              }}>
                {isFinished ? 'DONE' : formatTime(timeLeft)}
              </div>
              {!isFinished && (
                <div style={{
                  fontSize: '8px',
                  color: getTimeColor(),
                  textTransform: 'uppercase',
                  lineHeight: '1'
                }}>
                  {isTimeCritical ? '!!!' : isTimeWarning ? '!!' : 'time'}
                </div>
              )}
            </div>

            <Button
              type="primary"
              size="small"
              onClick={onSubmit}
              disabled={isFinished}
              style={{
                height: '32px',
                fontSize: '11px',
                fontWeight: 'bold',
                minWidth: '50px',
                background: isFinished ? '#52c41a' : undefined,
                borderColor: isFinished ? '#52c41a' : undefined,
                padding: '0 8px'
              }}
            >
              {isFinished ? '✅' : '📤'}
            </Button>
          </div>
        </div>
      ) : (
        <Row style={{ width: '100%' }} justify="space-between" align="middle">
          <Col flex="auto">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div>
                <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                  🎯 Đề thi mã số {title}
                </Title>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                  <Space size="middle">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '14px' }} />
                      <Text style={{ fontSize: '14px', color: '#52c41a', fontWeight: 'bold' }}>
                        Đã làm: {answeredCount}
                      </Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <QuestionCircleOutlined style={{ color: '#d9d9d9', fontSize: '14px' }} />
                      <Text style={{ fontSize: '14px', color: '#8c8c8c', fontWeight: 'bold' }}>
                        Còn lại: {totalQuestions - answeredCount}
                      </Text>
                    </div>
                    <Text style={{ fontSize: '13px', color: '#8c8c8c' }}>
                      (Tổng: {totalQuestions} câu)
                    </Text>
                  </Space>
                </div>
              </div>
            </div>
          </Col>

          <Col>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '24px'
            }}>
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
      )}
    </Header>
  );
};

export default ExamHeader;