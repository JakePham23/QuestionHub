import React from 'react';
import { List, Eye } from 'lucide-react';
import { QuestionNavigatorProps } from '@/types/exercise.type';

const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questions,
  currentIndex,
  onQuestionSelect,
  answeredQuestions,
  onToggleView,
  showAllQuestions,
}) => (
  <div
    style={{
      border: '1px solid #ddd',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      background: '#fff',
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
      <h4 style={{ margin: 0 }}>Danh sách câu hỏi</h4>
      <button
        onClick={onToggleView}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          border: '1px solid #ddd',
          borderRadius: 6,
          background: '#fff',
          cursor: 'pointer',
          fontSize: 12
        }}
      >
        {showAllQuestions ? <Eye size={16} /> : <List size={16} />}
        {showAllQuestions ? 'Xem từng câu' : 'Xem tất cả'}
      </button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
      {questions.map((_, index) => {
        const isCurrent = index === currentIndex;
        const isAnswered = answeredQuestions.has(index);
        return (
          <button
            key={index}
            onClick={() => onQuestionSelect(index)}
            style={{
              padding: '8px 0',
              borderRadius: 6,
              border: '1px solid #ddd',
              background: isCurrent
                ? '#1890ff'
                : isAnswered
                ? '#52c41a'
                : '#fafafa',
              color: isCurrent || isAnswered ? '#fff' : '#000',
              cursor: 'pointer',
            }}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  </div>
);

export default QuestionNavigator;