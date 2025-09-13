// QuestionNav.tsx

'use client'
import React from 'react';
import { Button, Tooltip, Typography, Progress, Grid, Flex } from 'antd';
import { CheckCircleOutlined, FireOutlined } from '@ant-design/icons';
import { List, Eye } from 'lucide-react';

const { Title } = Typography;
const { useBreakpoint } = Grid;

export interface QuestionNavProps {
  questions: { question_id: string }[];
  currentIndex: number;
  onSelect: (index: number) => void;
  answeredSet: Set<string | number>;
  collapsed?: boolean;
  extraContent?: React.ReactNode;
  showAll?: boolean;
  onToggleView?: () => void;
}

const QuestionNav: React.FC<QuestionNavProps> = ({
  questions,
  currentIndex,
  onSelect,
  answeredSet,
  collapsed = false,
  extraContent,
  showAll,
  onToggleView
}) => {
  const screens = useBreakpoint();
  const isMobile = screens.xs || screens.sm;

  const answeredCount = questions.filter(
    q => answeredSet.has(q.question_id)
  ).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  const getStatus = (idx: number) => {
    if (idx === currentIndex) return 'current';
    if (answeredSet.has(questions[idx].question_id)) return 'answered';
    return 'unanswered';
  };

  const header = (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: 12
    }}>
      <Title level={isMobile ? 5 : 4} style={{ margin: 0, color: '#1890ff' }}>
        📋 Danh sách câu hỏi
      </Title>

      {onToggleView && (
        <Button
          type="default"
          size="small"
          icon={showAll ? <Eye size={16}/> : <List size={16}/>}
          onClick={onToggleView}
        >
          {showAll ? 'Xem từng câu' : 'Xem tất cả'}
        </Button>
      )}
    </div>
  );

  const renderButton = (i: number) => {
    const status = getStatus(i);
    return (
      <Tooltip key={questions[i].question_id} title={`Câu ${i + 1}`}>
        <Button
          size="small"
          onClick={() => onSelect(i)}
          style={{
            minWidth: 36,
            height: isMobile ? 32 : 36,
            borderRadius: 6,
            border: 'none',
            background: status === 'current'
              ? 'linear-gradient(135deg, #1890ff, #40a9ff)'
              : status === 'answered'
                ? 'linear-gradient(135deg, #52c41a, #73d13d)'
                : '#fff',
            color: status === 'unanswered' ? '#8c8c8c' : '#fff',
            fontWeight: 'bold',
            fontSize: isMobile ? 12 : 13,
            boxShadow: status !== 'unanswered' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          {/* {status === 'answered' && <CheckCircleOutlined style={{ fontSize: 10, marginRight: 4 }}/>} */}
          {i + 1}
        </Button>
      </Tooltip>
    );
  };

  return (
    <div style={{
      padding: isMobile ? '12px' : '16px',
      background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)',
      height: '100%',
      overflowY: 'auto'
    }}>
      {header}

      {/* Tiến độ */}
      <div style={{
        background: '#fff',
        padding: '12px 16px',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        border: '1px solid #f0f0f0',
        marginBottom: 16
      }}>
        <Progress
          percent={progressPercent}
          strokeColor={{ from: '#108ee9', to: '#87d068' }}
          trailColor="#f0f0f0"
          size={6}
          showInfo={false}
          style={{ marginBottom: 8 }}
        />
        <div style={{
          display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#666'
        }}>
          <span>Tiến độ: {progressPercent}%</span>
          <span>Còn lại: {questions.length - answeredCount} câu</span>
        </div>
      </div>

      {/* Các nút câu hỏi — dùng Flex wrap để tự xuống dòng */}
      <Flex wrap="wrap" gap={8} style={{ width: '100%' }}>
        {questions.map((_, i) => renderButton(i))}
      </Flex>

      {extraContent && (
        <div style={{ marginTop: 20 }}>
          {extraContent}
        </div>
      )}
    </div>
  );
};

export default QuestionNav;