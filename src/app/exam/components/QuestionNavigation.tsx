'use client'
import { Button, Tooltip, Typography, Progress, Grid } from 'antd';
import { 
  CheckCircleOutlined, 
  QuestionCircleOutlined,
  BarsOutlined,
  FireOutlined
} from '@ant-design/icons';
import React from 'react';

// Import types từ file trung tâm
import { Question, UserAnswers, ExamStatus } from '@/types/exam.type';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

interface QuestionNavigationProps {
  questions: Question[];
  userAnswers: UserAnswers;
  currentQuestionIndex: number;
  onQuestionClick: (index: number) => void;
  collapsed: boolean;
  examStatus: ExamStatus;
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({ 
  questions, 
  userAnswers, 
  currentQuestionIndex, 
  onQuestionClick, 
  collapsed,
  examStatus 
}) => {
  const screens = useBreakpoint();
  const isMobile = screens.xs || screens.sm;
  const isFinished = examStatus === 'submitted' || examStatus === 'time-up';

  const getQuestionStatus = (question: Question, index: number): 'current' | 'answered' | 'unanswered' => {
    const isAnswered = userAnswers.hasOwnProperty(question.question_id);
    const isCurrent = index === currentQuestionIndex;
    
    if (isCurrent && !isFinished) {
      return 'current';
    } else if (isAnswered) {
      return 'answered';
    } else {
      return 'unanswered';
    }
  };

  const answeredCount = questions.filter(q => userAnswers.hasOwnProperty(q.question_id)).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  if (collapsed) {
    return (
      <div style={{ 
        padding: isMobile ? '12px 6px' : '16px 8px',
        background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)',
        height: '100%'
      }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '16px',
          padding: '8px',
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <BarsOutlined style={{ 
            fontSize: isMobile ? '16px' : '20px', 
            color: '#1890ff',
            marginBottom: '4px'
          }} />
          <div style={{ fontSize: '10px', color: '#666', fontWeight: 'bold' }}>
            {answeredCount}/{questions.length}
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: isMobile ? '4px' : '6px',
          maxHeight: 'calc(100vh - 150px)',
          overflowY: 'auto'
        }}>
          {questions.map((question, index) => {
            const status = getQuestionStatus(question, index);
            
            return (
              <Tooltip 
                key={question.question_id} 
                title={`Câu ${index + 1} - ${status === 'answered' ? 'Đã trả lời' : status === 'current' ? 'Đang xem' : 'Chưa trả lời'}`}
                placement="right"
              >
                <Button
                  size="small"
                  onClick={() => onQuestionClick(index)}
                  style={{
                    width: '100%',
                    height: isMobile ? '28px' : '32px',
                    borderRadius: '6px',
                    border: 'none',
                    background: status === 'current' 
                      ? 'linear-gradient(135deg, #1890ff, #40a9ff)'
                      : status === 'answered'
                      ? 'linear-gradient(135deg, #52c41a, #73d13d)'
                      : '#f5f5f5',
                    color: status === 'unanswered' ? '#8c8c8c' : '#fff',
                    fontWeight: 'bold',
                    fontSize: isMobile ? '11px' : '12px',
                    boxShadow: status !== 'unanswered' ? '0 2px 4px rgba(0,0,0,0.15)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (status === 'unanswered') {
                      e.currentTarget.style.background = '#e6f7ff';
                      e.currentTarget.style.color = '#1890ff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (status === 'unanswered') {
                      e.currentTarget.style.background = '#f5f5f5';
                      e.currentTarget.style.color = '#8c8c8c';
                    }
                  }}
                >
                  {status === 'current' && <FireOutlined style={{ marginRight: '4px' }} />}
                  {status === 'answered' && <CheckCircleOutlined style={{ marginRight: '4px' }} />}
                  {index + 1}
                </Button>
              </Tooltip>
            );
          })}
        </div>
      </div>
    );
  }

  const gridColumns = isMobile ? 5 : 6;

  return (
    <div style={{ 
      padding: isMobile ? '16px 12px' : '20px 16px',
      height: '100vh',
      overflowY: 'auto',
      background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)'
    }}>
      <div style={{ 
        marginBottom: '20px',
        background: '#fff',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '1px solid #e8e8e8'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          <Title level={isMobile ? 5 : 4} style={{ margin: 0, color: '#1890ff' }}>
            📋 Danh sách câu hỏi
          </Title>
          <div style={{
            background: 'linear-gradient(135deg, #1890ff, #40a9ff)',
            color: '#fff',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {answeredCount}/{questions.length}
          </div>
        </div>
        
        <Progress
          percent={progressPercent}
          strokeColor={{
            from: '#108ee9',
            to: '#87d068',
          }}
          trailColor="#f0f0f0"
          size ={8}
          showInfo={false}
          style={{ marginBottom: '8px' }}
        />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#666'
        }}>
          <span>Tiến độ: {progressPercent}%</span>
          <span>Còn lại: {questions.length - answeredCount} câu</span>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-around',
        marginBottom: '16px',
        background: '#fff',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '3px',
            background: 'linear-gradient(135deg, #1890ff, #40a9ff)'
          }} />
          <Text style={{ fontSize: '11px', color: '#666' }}>Hiện tại</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '3px',
            background: 'linear-gradient(135deg, #52c41a, #73d13d)'
          }} />
          <Text style={{ fontSize: '11px', color: '#666' }}>Đã làm</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '3px',
            background: '#f5f5f5',
            border: '1px solid #d9d9d9'
          }} />
          <Text style={{ fontSize: '11px', color: '#666' }}>Chưa làm</Text>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
        gap: isMobile ? '8px' : '10px',
        marginBottom: '20px'
      }}>
        {questions.map((question, index) => {
          const status = getQuestionStatus(question, index);
          
          return (
            <Tooltip 
              key={question.question_id} 
              title={`Câu ${index + 1} - ${status === 'answered' ? 'Đã trả lời' : status === 'current' ? 'Đang làm' : 'Chưa trả lời'}`}
            >
              <Button
                onClick={() => onQuestionClick(index)}
                style={{
                  height: isMobile ? '36px' : '40px',
                  borderRadius: '8px',
                  border: 'none',
                  background: status === 'current' 
                    ? 'linear-gradient(135deg, #1890ff, #40a9ff)'
                    : status === 'answered'
                    ? 'linear-gradient(135deg, #52c41a, #73d13d)'
                    : '#fff',
                  color: status === 'unanswered' ? '#8c8c8c' : '#fff',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '12px' : '14px',
                  boxShadow: status !== 'unanswered' 
                    ? '0 3px 8px rgba(0,0,0,0.15)' 
                    : '0 2px 4px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (status === 'unanswered') {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #e6f7ff, #bae7ff)';
                    e.currentTarget.style.color = '#1890ff';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (status === 'unanswered') {
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.color = '#8c8c8c';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {status === 'current' && (
                  <div style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    width: '6px',
                    height: '6px',
                    background: '#fff',
                    borderRadius: '50%',
                    animation: 'pulse 1.5s infinite'
                  }} />
                )}
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  {status === 'answered' && <CheckCircleOutlined style={{ fontSize: '10px' }} />}
                  {index + 1}
                </div>
              </Button>
            </Tooltip>
          );
        })}
      </div>

      {!isFinished && (
        <div style={{ 
          background: 'linear-gradient(135deg, #f6ffed, #d9f7be)',
          border: '1px solid #b7eb8f',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(135, 208, 104, 0.15)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            marginBottom: '8px'
          }}>
            <div style={{
              background: '#52c41a',
              color: '#fff',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px'
            }}>
              💡
            </div>
            <Text style={{ fontSize: '13px', fontWeight: 'bold', color: '#389e0d' }}>
              Mẹo làm bài
            </Text>
          </div>
          <Text style={{ fontSize: '12px', color: '#666', lineHeight: '1.5' }}>
            Click vào số câu để nhảy nhanh. Màu xanh dương là câu đang làm, màu xanh lá là đã hoàn thành.
          </Text>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default QuestionNavigation;